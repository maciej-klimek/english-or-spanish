package main

import (
	"context"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/joho/godotenv"
	"encoding/json"
	"fmt"
	"log"
	"io"
	"net/http"
	"os"
)

type ClientRequestData struct {
	Input    string `json:"user_input"`
	Language string `json:"language"`
}

type OpenAiResponseData struct {
	CorrInput  string `json:"corrected_input"`
	AiResponse string `json:"prompt_response"`
}

func handleClientRequest(wrt http.ResponseWriter, req *http.Request) {

	fmt.Println("> handleClientRequest called")

	if req.Method == http.MethodOptions {
		wrt.Header().Set("Access-Control-Allow-Origin", "*")
		wrt.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		wrt.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		wrt.WriteHeader(http.StatusOK)
		return
	}

	if req.Method != http.MethodPost {
		http.Error(wrt, "Invalid Request Method", http.StatusMethodNotAllowed)
		return
	}

	var clientData ClientRequestData
	err := json.NewDecoder(req.Body).Decode(&clientData)

	if err != nil {
		http.Error(wrt, "Error while decoding request data", http.StatusBadRequest)
		return
	}

	fmt.Printf("	> Recived:\n	User input: %s\n	Language: %s\n", clientData.Input, clientData.Language)
	
	aiResponse := callOpenAiAPI(clientData)

    response := map[string]interface{}{
        "status":       "success",
        "message":      "Request received",
        "corrected_input": aiResponse.CorrInput,
        "ai_response":  aiResponse.AiResponse,
    }
	
	wrt.Header().Set("Content-Type", "application/json")
	json.NewEncoder(wrt).Encode(response)
}

func callOpenAiAPI(clientData ClientRequestData) (response OpenAiResponseData) {
	// Load the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	
	apiKey, exists := os.LookupEnv("OPENAI_API_KEY")
	if !exists {
		log.Fatal("OPENAI_API_KEY is not set in the environment")
	}

	context_file, err := os.Open("context.txt")
	if err != nil {
		panic(err)
	}

	defer func() {
		if err = context_file.Close(); err != nil {
			panic(err)
		}
	}()

	b, err := io.ReadAll(context_file)
	contextText := string(b)

	fullPrompt := fmt.Sprintf(
        "%s\nThe student sent you a message: %s. "+
        "First, reply naturally to the message in %s, try to get a feel for the level at which the student uses the language, "+
        "but reply in perfect grammar and make no spelling mistakes. "+
        "Then, correct the mistakes (if there are any) in the student message, and create a corrected version of that sentence.",
        contextText, clientData.Input, clientData.Language,
    )

	client := openai.NewClient(
		option.WithAPIKey(apiKey), 
	)
	ctx := context.Background()

	completion, err := client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
        Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
            openai.UserMessage(fullPrompt),
        }),
        Seed:  openai.Int(1),
        Model: openai.F(openai.ChatModelGPT4),
    })
    if err != nil {
        log.Fatalf("Error calling OpenAI API: %v", err)
    }

	aiResponse := completion.Choices[0].Message.Content
	fmt.Println(aiResponse)
   
    response.CorrInput = "corrected version of the input" 
    response.AiResponse = aiResponse

	return response
}

func main() {
	//callOpenAiAPI("AA")
	fmt.Println("> Server is running")
	http.HandleFunc("/", handleClientRequest)
	http.ListenAndServe(":3000", nil)
}
