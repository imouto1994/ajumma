import "./App.css";

import React, { useEffect, useState, useCallback } from "react";

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.REACT_APP_GITHUB_ACCESS_TOKEN,
});

function getName(name) {
  if (!name.startsWith("rev-")) {
    return name;
  }

  return name.substring(4).split("").reverse().join("");
}

const GITHUB_USERNAME = "edelgard127";
const TEMPLATE_REPO_NAME = "boilerplate";

function App() {
  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);

  const messageEventHandler = useCallback(
    (event) => {
      if (event.data === "close") {
        setSelectedName(null);
      }
    },
    [setSelectedName]
  );

  useEffect(() => {
    (async () => {
      const { data: repos } = await octokit.rest.repos.listForUser({
        username: GITHUB_USERNAME,
      });
      setNames(
        repos
          .map((repo) => repo.name)
          .filter((name) => name !== TEMPLATE_REPO_NAME)
      );
    })();
  }, []);

  useEffect(() => {
    window.addEventListener("message", messageEventHandler, false);

    return () => {
      window.removeEventListener("message", messageEventHandler, false);
    };
  }, [messageEventHandler]);

  return (
    <div className="App">
      {selectedName != null ? (
        <iframe
          src={`https://${GITHUB_USERNAME}.github.io/${selectedName}/`}
          className="App-iframe"
          title="Active title"
        />
      ) : null}
      {names.map((name) => (
        <div
          key={name}
          className="App-link"
          onClick={() => setSelectedName(name)}
        >
          {getName(name)}
        </div>
      ))}
    </div>
  );
}

export default App;
