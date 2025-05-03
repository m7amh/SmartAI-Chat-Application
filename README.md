# SmartAI Chat Application

A modern, AI-powered chat application integrated with the **Groq AI API** to provide intelligent conversations. This app supports both **Arabic** and **English** languages and is designed with a responsive layout and intuitive UI.

---

## 🚀 **Features**

* **RTL Layout**: Arabic text support (`dir="rtl"`).
* **Interactive Chat**: Engage in AI-powered conversations.
* **Responsive Design**: Optimized for all screen sizes.
* **Message Persistence**: Conversations are saved locally using **localStorage**.
* **Export Chat**: Export chat history as a text file.
* **Message Copying**: Easily copy messages with one click.
* **Notification Sound**: Alerts when a new message is received.
* **Control Buttons**:

  * **Send**
  * **Clear**
  * **Export**
  * **Reset**

---

## ⚙️ **Technologies Used**

* **Frontend**:

  * HTML, CSS, JavaScript
  * Responsive design with support for RTL layout.

* **Backend**:

  * **Node.js** with **Express**
  * **Axios** for API requests
  * **CORS** for cross-origin resource sharing
  * **Dotenv** for environment variables

* **AI Integration**:

  * Groq AI API (using the **Llama-3-70b-8192** model).

---

## 📂 **Project Structure**

```
/node_modules             # Dependencies
.env                      # Environment variables (API_KEY, PORT)
/index.html               # The main HTML page for the chat app
/package-lock.json        # Automatically generated for any operations where npm modifies the node_modules directory
/package.json             # Contains metadata and dependencies for the project
/server.js                # Backend code to handle API requests
README.md                 # Project documentation
```

---

## 🛠️ **Installation**

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/SmartAI-Chat-App.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SmartAI-Chat-App
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your **Groq API Key**:

   ```
   API_KEY=your_groq_api_key_here
   PORT=4000
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. The server will run on [http://localhost:4000](http://localhost:4000).

---

## 💡 **How It Works**

1. The user types a message in the input field and hits **Send**.
2. The message is sent to the backend, which forwards it to the **Groq AI API**.
3. The AI processes the message and returns a response.
4. The response is displayed in the chat window with a timestamp.
5. The entire conversation is saved to **localStorage** to maintain chat history across sessions.

---

## ⚠️ **Troubleshooting**

* **Server Not Running**: Ensure port **4000** is open and the `.env` file exists with a valid API key.
* **No Responses from AI**: Check your internet connection and verify the API key.
* **UI Issues**: Refresh the page or clear the browser cache.

---

## 🤝 **Contributing**

Contributions are welcome! Feel free to fork the repository, submit issues, and create pull requests. Let's improve this project together!

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📢 **Contact**

For any questions or inquiries, please feel free to contact me via:

* **Email**: [Mohamed2291971@gmail.com]
* **GitHub**: [m7amh](https://github.com/m7amh)

---

يمكنك تعديل النصوص مثل `your-email@example.com` و `your-username` بما يتناسب مع معلوماتك الشخصية.
