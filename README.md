# 🩺 Remedy Radar

Remedy Radar is an intelligent health assistant built with Angular. It helps users understand their symptoms, get instant medicine recommendations, and find answers to their health queries through an integrated chatbot.

### ✨ [Remedy Radar](https://remedy-radar.netlify.app/)

-----

## 📖 About The Project

Getting quick and reliable health information can be difficult. **Remedy Radar** addresses this by providing an intuitive platform where users can input their symptoms and receive immediate, data-driven suggestions for over-the-counter medications. The application also features a helpful chatbot to answer general health-related questions, acting as a first point of contact for minor health concerns.

**Key Features:**

  * **Symptom Checker:** An easy-to-use interface for users to report their symptoms.
  * **Medicine Recommendation:** Instantly suggests potential medications based on the symptoms provided.
  * **Integrated Chatbot:** A conversational AI to assist users with their health questions.
  * **Responsive Design:** A clean and accessible user experience on both desktop and mobile devices.

-----

## 🛠️ Built With

  * **Frontend:** [Angular](https://angular.io/)
  * **Backend:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
  * **Database:** [MongoDB](https://www.mongodb.com/)
  * **Deployment:** [Netlify](https://www.netlify.com/) (Frontend)

-----

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following software installed on your machine:

  * [Node.js](https://nodejs.org/en/download/) (which includes npm)
  * [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)
  * [Git](https://git-scm.com/downloads)

### Installation & Setup

1.  **Clone the Repository**

    ```sh
    git clone https://github.com/Nithish-Balaji-21/RR.git
    cd RR
    ```

2.  **Setup the Backend**
    In your terminal, navigate to the `backend` folder, install dependencies, and run the server.

    ```sh
    # Navigate into the backend directory
    cd backend

    # Install backend dependencies
    npm install
    ```

    Next, create a **`.env`** file in the `backend` directory and add your environment variables.

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key_for_tokens
    ```

    Finally, start the backend server. Keep this terminal open.

    ```sh
    # Run the server
    npm start
    ```

    The backend will now be running, typically on `http://localhost:5000`.

3.  **Setup the Frontend**
    Open a **new terminal window** and navigate to the `frontend` folder to set it up.

    ```sh
    # Navigate to the frontend directory from the root
    cd frontend 
    # Note: If your frontend is in the root, just 'cd ..' from the backend folder.

    # Install frontend dependencies
    npm install
    ```

    Now, run the Angular development server.

    ```sh
    # Serve the Angular app
    ng serve
    ```

    Open your browser and navigate to `http://localhost:4200/`. The app will be running and connected to your local backend.
