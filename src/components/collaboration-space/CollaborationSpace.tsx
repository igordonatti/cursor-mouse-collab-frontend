'use client'

import { socket } from "@/lib/socket";
import { Cursor as CursorType } from "@/types";
import { MouseEvent, useEffect, useState } from "react";
import { Cursor } from "./Cursor";

// Usamos um Record (dicionário) para acesso rápido aos cursores por ID
type CursorsState = Record<string, CursorType>;

export function CollaborationSpace() {
  const [myCursor, setMyCursor] = useState<CursorType | null>(null);
  const [cursors, setCursors] = useState<CursorsState>({});

  useEffect(() => {
    // Conecta ao servidor quando o componente é montado
    socket.connect();

    // Evento: quando a conexão é estabelecida
    function onConnect() {
      console.log("Conectado ao servidor!");
      setMyCursor({id: socket.id!, color: 'white'}) // Define o nosso próprio cursor
    }

    // Evento: recebe a lista de usuários já existentes
    function onExistingUsers(existingUsers: CursorType[]) {
      const usersAsObject = existingUsers.reduce((acc, user) => {
        if (user.id !== socket.id) {
          acc[user.id] = user;
        }
        return acc;
      }, {} as CursorsState);
      setCursors(usersAsObject);
    }

    // Evento: um novo usuário entrou
    function onUserJoined(user: CursorType){
      console.log(`Usuário entrou: ${user.id}`);
      setCursors((prev) => ({...prev, [user.id]: user}))
    }

    // Evento: um usuário saiu
    function onUserLeft(userId: string) {
      console.log(`Usuário saiu: ${userId}`);
      setCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    }

    // Evento: recebeu atualização da posição de um cursor
    function onCursorUpdate(update: { id: string; x: number; y: number; }) {
      setCursors((prev) => {
        // Atualiza a posição x e y do cursor específico
        if(prev[update.id]) {
          const updatedUser = { ...prev[update.id], x: update.x, y: update.y }
          return { ...prev, [update.id]: updatedUser }
        }
        return prev;
      });
    }

    // Registra os listeners
    socket.on('connect', onConnect);
    socket.on('existing-users', onExistingUsers);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);
    socket.on('cursor-update', onCursorUpdate);

    // Função de limpeza: remove os listeners e desconecta quando o componente é desmontado
    return () => {
      socket.off('connect', onConnect);
      socket.off('existing-users', onExistingUsers);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
      socket.off('cursor-update', onCursorUpdate);
      socket.disconnect();
    };
  }, []);

  // Função para lidar com o movimento do mouse
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    // Emite a nova posição para o servidor
    socket.emit('cursor-move', { x: clientX, y: clientY });
    // Atualiza a posição do nosso próprio cursor para feedback imediato
    if (myCursor) {
      setMyCursor({ ...myCursor, x: clientX, y: clientY });
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Renderiza o nosso próprio cursor */}
      {myCursor && <Cursor cursor={myCursor} />}

      {/* Renderiza os cursores dos outros usuários */}
      {Object.values(cursors).map((cursor) => (
        <Cursor key={cursor.id} cursor={cursor} />
      ))}
    </div>
  )
}