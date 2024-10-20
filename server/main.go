package main

import (
	"encoding/json"
	"fmt"
	"net/http"
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
	fmt.Println("> handleUserInput hanlder called")
	if req.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(wrt, "Invalid Request Method", err)
		return
	}
	var client_data ClientRequestData
	err := json.NewDecoder(req.Body).Decode(&client_data)

	if err != nil {
		http.Error(wrt, "Error while decoding request data", http.StatusBadRequest)
		return
	}

	fmt.Println(client_data)
}

func main() {
	fmt.Println("> Server is running")
	http.HandleFunc("/", handleClientRequest)
	http.ListenAndServe(":3000", nil)
}
