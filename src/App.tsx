import "./App.css";

import { Amplify } from "aws-amplify";

import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

import amplifyconfig from "./amplifyconfiguration.json";
import useTodos from "./hooks/useTodos";

Amplify.configure(amplifyconfig);

function App() {
  const { todos, isLoading, createTodo, deleteTodo } = useTodos();
  return (
    <div className="App">
      <Authenticator>
        {({ signOut }) => (
          <main>
            <header className="App-header">
              {isLoading && <p>Loading...</p>}
              {!isLoading &&
                todos.map((todo, idx) => (
                  <div key={idx} style={{}}>
                    <p>{todo.id}</p>
                    <p>{todo.name}</p>
                    <p>{todo.description || ""}</p>
                    <p>{todo.createdAt || ""}</p>
                    <button onClick={() => {}}>Update</button>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                ))}
              <button
                onClick={() => createTodo()}
                style={{
                  margin: "20px",
                  fontSize: "0.8rem",
                  padding: "5px 10px",
                  marginTop: "20px",
                }}
              >
                Add Todo
              </button>
              <button
                onClick={signOut}
                style={{
                  margin: "20px",
                  fontSize: "0.8rem",
                  padding: "5px 10px",
                  marginTop: "20px",
                }}
              >
                Sign Out
              </button>
            </header>
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default withAuthenticator(App);
