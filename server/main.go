package main

import (
	"encoding/json"
	"fmt"
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

	response := map[string]string{
		"status":  "success",
		"message": "Request received",
	}

	wrt.Header().Set("Content-Type", "application/json")
	json.NewEncoder(wrt).Encode(response)
}

func callOpenAiAPI(user_prompt string) (response OpenAiResponseData) {
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
	fmt.Println(string(b))

	return response
}

func main() {
	//callOpenAiAPI("AA")
	fmt.Println("> Server is running")
	http.HandleFunc("/", handleClientRequest)
	http.ListenAndServe(":3000", nil)
}
