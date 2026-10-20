"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type User = {
  id: number;
  name: string;
  age: number;
  status: "EMPLOYEE" | "CLIENT";
};

async function request(url: string, options?: RequestInit) {
  const response = await fetch(url, { cache: "no-store", ...options });
  if (!response.ok) throw new Error(`Ошибка запроса: HTTP ${response.status}`);
  return response;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState<User["status"]>("CLIENT");
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    const response = await request("/users");
    setUsers(await response.json());
  }

  async function runAction(action: () => Promise<void>) {
    setPending(true);
    setError("");
    try {
      await action();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Не удалось выполнить запрос");
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    void runAction(loadUsers);
  }, []);

  function resetForm() {
    setSelectedId(null);
    setName("");
    setAge("");
    setStatus("CLIENT");
  }

  function selectUser(id: number) {
    void runAction(async () => {
      const response = await request(`/users/${id}`);
      const user: User | null = await response.json();
      if (!user) throw new Error("Пользователь не найден");
      setSelectedId(user.id);
      setName(user.name);
      setAge(String(user.age));
      setStatus(user.status);
    });
  }

  function saveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runAction(async () => {
      await request(selectedId === null ? "/users" : `/users/${selectedId}`, {
        method: selectedId === null ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), age: Number(age), status }),
      });
      resetForm();
      await loadUsers();
    });
  }

  function deleteUser() {
    if (selectedId === null) return;
    void runAction(async () => {
      await request(`/users/${selectedId}`, { method: "DELETE" });
      resetForm();
      await loadUsers();
    });
  }

  return (
    <main>
      <h1>Пользователи</h1>
      {error && <p role="alert">{error}</p>}
      <p role="status" style={{ minHeight: "1.2em" }}>
        {pending ? "Загрузка…" : ""}
      </p>
      <button disabled={pending} onClick={() => void runAction(loadUsers)}>
        Обновить список
      </button>
      <table>
        <thead>
          <tr>
            <th>Выбор</th><th>ID</th><th>Имя</th><th>Возраст</th><th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="radio"
                  name="selectedUser"
                  aria-label={`Выбрать пользователя ${user.name}, ID ${user.id}`}
                  checked={selectedId === user.id}
                  disabled={pending}
                  onChange={() => selectUser(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.status === "EMPLOYEE" ? "Сотрудник" : "Клиент"}</td>
            </tr>
          ))}
          {!pending && !error && users.length === 0 && (
            <tr><td colSpan={5}>Пользователей пока нет</td></tr>
          )}
        </tbody>
      </table>

      <h2>{selectedId === null ? "Создать пользователя" : `Пользователь №${selectedId}`}</h2>
      <form onSubmit={saveUser}>
        <fieldset disabled={pending}>
          <label>
            Имя
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Возраст
            <input type="number" required min="0" max="2147483647" step="1" value={age} onChange={(event) => setAge(event.target.value)} />
          </label>
          <label>
            Статус
            <select value={status} onChange={(event) => setStatus(event.target.value as User["status"])}>
              <option value="CLIENT">Клиент</option>
              <option value="EMPLOYEE">Сотрудник</option>
            </select>
          </label>
          <button type="submit" disabled={!name.trim()}>
            {selectedId === null ? "Создать" : "Сохранить"}
          </button>
          {selectedId !== null && (
            <>
              <button type="button" onClick={deleteUser}>Удалить</button>
              <button type="button" onClick={resetForm}>Отменить выбор / создать нового</button>
            </>
          )}
        </fieldset>
      </form>
    </main>
  );
}
