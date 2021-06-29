
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'


import {Button} from '../components/Button'
import {useHistory} from 'react-router-dom'

import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'

import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'

export function Home(){

    const history = useHistory();
    const {user,signInWithGoogle} = useAuth();
    const [roomCode, setroomCode] = useState('')    
    async function handleCreateRoom(){  
        if(!user){
            await signInWithGoogle()
        }
        history.push('/rooms/new')   
    }

    async function handleJoinRoom(event:FormEvent) {
        event.preventDefault()
        if(roomCode.trim() === ''){
            return;
        }
        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()){
            alert('Room does not exists.')
            return;
        }
        if(roomRef.val().endedAt){
            alert(`Room already closed`);
            return;
        }
        history.push(`/rooms/${roomCode}`)
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando pergunas e respostas"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>            
                <p>Tire as dúvidas de sua audiência em tempo real</p>

            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt=""/>
                    <button className="create-room" onClick={handleCreateRoom}>
                        <img src={googleIconImg} alt=""/>
                        Crie sua sala com google
                    </button>
                
                <div className="separator">Entre em uma sala</div>
                <form onSubmit={handleJoinRoom}>
                    <input 
                        type="text"
                        placeholder="Digite o código da sala"
                        onChange = {event => setroomCode(event.target.value)}
                        value = {roomCode}
                    />
                    <Button type="submit" className="button">
                        Entrar na sala
                    </Button>

                </form>
                </div>
            </main>
        </div>
    )
}