# Interactive Prompt Playground

An interactive playground to experiment with prompt engineering and model parameters using OpenAI's GPT models. This tool allows users to dynamically generate product descriptions by adjusting parameters like `temperature`, `max_tokens`, `presence_penalty`, `frequency_penalty`, and more to observe how these affect the output.

---

## 🚀 How to Run the Playground

### Prerequisites

- Node.js and npm installed
- Gemini API key (do not expose it in code)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/interactive-prompt-playground.git
cd interactive-prompt-playground
2.Install dependencies
npm install
3.Create a .env file and add your OpenAI API key:
VITE_GEMINI_API_KEY=your-api-key-here
4.Start the development server:
npm run dev

🧩 Features
| Feature           | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| Model Selection   | Choose between `gpt-3.5-turbo` and `gpt-4`                       |
| System Prompt     | Set a global instruction for the assistant                       |
| User Prompt       | Provide the item or topic for which you want a description       |
| Temperature       | Controls randomness/creativity (range: 0.0 to 2.0)               |
| Max Tokens        | Limits output length (range: 50, 150, 300)                       |
| Presence Penalty  | Encourages new topics to be discussed (range: 0.0 to 1.5)        |
| Frequency Penalty | Reduces repetition in the output (range: 0.0 to 1.5)             |
| Stop Sequences    | Enter phrases to stop generation                                 |
| Results View      | Displays and compares generated responses with selected settings |
| Export Button     | Export results to a file for further analysis                    |


📊 Output Table (Sample)
| Model         | Temperature | Tokens | Presence Penalty | Frequency Penalty | Output Snippet                                                                 |
| ------------- | ----------- | ------ | ---------------- | ----------------- | ------------------------------------------------------------------------------ |
| gpt-3.5-turbo | 0.0         | 150    | 0.0              | 0.0               | "Introducing the iPhone. A smartphone with cutting-edge design..."             |
| gpt-3.5-turbo | 0.7         | 150    | 0.7              | 0.7               | "Meet the revolutionary iPhone – not just a phone, but a pocket-sized studio!" |
| gpt-4         | 1.2         | 300    | 1.5              | 1.5               | "The Tesla is more than a car—it’s a cosmic leap into the future..."           |

🧠 Reflection
While running tests with varying parameters, we noticed that increasing temperature results in more creative and imaginative outputs, sometimes bordering on fantastical. A value like 0.0 generates more factual, predictable descriptions, whereas 1.2 introduces poetic metaphors and vivid storytelling. The temperature parameter is excellent for toggling between precision and creativity.

Adjusting presence_penalty and frequency_penalty greatly impacts the lexical and topical variety of the responses. High values for both penalties encourage fresh language and reduce redundancy. For instance, with presence_penalty = 1.5, the model avoids reusing common phrases and explores more niche descriptors. This playground helped us understand how fine-tuning these parameters can align outputs with specific use-cases—ranging from marketing copy to technical summaries.
