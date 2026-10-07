"use client";

import { useState } from "react";

export default function Home() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState("");

  async function sendTestRequest() {
    setPending(true);
    setResult("");

    try {
      const response = await fetch("/api/test", { method: "POST" });

      if (!response.ok) {
        throw new Error(`Сервер вернул HTTP ${response.status}`);
      }

      const data = await response.json();
      setResult(`Запрос выполнен: ${JSON.stringify(data)}`);
    } catch (error) {
      setResult(
        error instanceof Error
          ? `Ошибка запроса: ${error.message}`
          : "Не удалось отправить запрос. Попробуйте ещё раз.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main>
      <span className="label">ТЕСТОВЫЙ ЗАПРОС</span>
      <h1>Проверка соединения.</h1>
      <p>Нажмите кнопку, чтобы отправить тестовый запрос на сервер.</p>
      <button type="button" onClick={sendTestRequest} disabled={pending}>
        {pending ? "Отправка…" : "Отправить тестовый запрос"}
      </button>
      <p className="request-result" role="status" aria-live="polite">
        {result}
      </p>
    </main>
  );
}
