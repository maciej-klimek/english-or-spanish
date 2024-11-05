package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

type ClientRequestData struct {
	Input    string `json:"user_input"`
	Language string `json:"language"`
}

type OpenAiResponseData struct {
	AiResponse string `json:"prompt_response"`
}

func handleClientRequest(wrt http.ResponseWriter, req *http.Request) {

	fmt.Println("> handleClientRequest called")

	wrt.Header().Set("Access-Control-Allow-Origin", "*")
	wrt.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	wrt.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if req.Method == http.MethodOptions {
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

	fmt.Printf("	> Received:\n	User input: %s\n	Language: %s\n", clientData.Input, clientData.Language)

	aiResponse, err := callOpenAiAPI(clientData)
	if err != nil {
		http.Error(wrt, "Error calling OpenAI API", http.StatusInternalServerError)
		return
	}

	wrt.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(wrt).Encode(aiResponse)
	if err != nil {
		http.Error(wrt, "Error encoding response data", http.StatusInternalServerError)
		return
	}

}

func callOpenAiAPI(clientData ClientRequestData) (OpenAiResponseData, error) {
	err := godotenv.Load()
	if err != nil {
		return OpenAiResponseData{}, fmt.Errorf("Error loading .env file: %v", err)
	}

	apiKey, exists := os.LookupEnv("OPENAI_API_KEY")
	if !exists {
		return OpenAiResponseData{}, fmt.Errorf("OPENAI_API_KEY is not set in the environment")
	}

	contextFile, err := os.Open("context.txt")
	if err != nil {
		return OpenAiResponseData{}, err
	}
	defer contextFile.Close()

	b, err := io.ReadAll(contextFile)
	if err != nil {
		return OpenAiResponseData{}, err
	}
	contextText := string(b)

	fullPrompt := fmt.Sprintf(
		"%s\nThe student sent you a message: '%s'. The message is written in %s.\n"+
			"First, respond naturally to the message in the same language, %s, using perfect grammar and making no spelling mistakes. "+
			"Then, identify and correct any mistakes in the student's message and provide a corrected version of their sentence."+
			"Ansear to error_info in english",
		contextText, clientData.Input, clientData.Language, clientData.Language,
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
		return OpenAiResponseData{}, fmt.Errorf("Error calling OpenAI API: %v", err)
	}

	aiResponse := completion.Choices[0].Message.Content
	fmt.Println(aiResponse)

	return OpenAiResponseData{
		AiResponse: aiResponse,
	}, nil
}

func main() {
	fmt.Println("> Server is running")
	http.HandleFunc("/", handleClientRequest)
	http.ListenAndServe(":3000", nil)
}
