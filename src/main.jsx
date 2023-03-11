import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "normalize.css"
import "./index.css"
import { Provider } from "react-redux"
import { store } from "./store"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist/"
import { disableReactDevTools } from "@fvilers/disable-react-devtools"

if (process.env.NODE_ENV === "production") disableReactDevTools()

let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
