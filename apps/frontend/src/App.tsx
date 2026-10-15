/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { useMutation, useQuery } from "@tanstack/react-query";
import { greetingNameConstraints } from "@repo/schemas";
import { greetingMutationOptions, healthQueryOptions } from "./lib/api-options";
import { useUiStore } from "./stores/ui";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@repo/ui";

export default function App() {
  const count = useUiStore((state) => state.count);
  const increment = useUiStore((state) => state.increment);
  const name = useUiStore((state) => state.name);
  const setName = useUiStore((state) => state.setName);
  const health = useQuery(healthQueryOptions);
  const greeting = useMutation(greetingMutationOptions);
  const message = greeting.isError
    ? greeting.error.message
    : (greeting.data?.message ?? "Check the typed API connection");

  return (
    <div className="app">
      <div className="app-inner">
        <div>
          <a href="https://vite.dev" target="_blank" className="logo-link">
            <img
              alt="Vite logo"
              src={viteLogo}
              className="logo animated-logo"
            />
          </a>
          <a href="https://react.dev" target="_blank" className="logo-link">
            <img
              alt="React logo"
              src={reactLogo}
              className="logo react-logo animated-logo"
            />
          </a>
        </div>
        <h1 className="app-title">Vite + React</h1>
        <div className="card">
          <p role="status">
            {health.isPending
              ? "Checking API…"
              : health.isError
                ? "API unavailable"
                : "API connected"}
          </p>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              greeting.mutate({ name });
            }}
          >
            <label htmlFor="greeting-name">Name</label>
            <input
              id="greeting-name"
              name="name"
              type="text"
              value={name}
              maxLength={greetingNameConstraints.maxLength}
              onChange={(event) => setName(event.target.value)}
              className="greeting-input"
            />
            <Button type="submit" disabled={greeting.isPending}>
              {greeting.isPending ? "Connecting…" : "Call the API"}
            </Button>
          </form>
          <p role="status">{message}</p>
          <button className="counter-button" onClick={increment}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}
