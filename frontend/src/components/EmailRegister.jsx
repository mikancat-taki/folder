import React, {useState} from 'react'


export default function EmailRegister(){
const [email, setEmail] = useState('')
const [msg, setMsg] = useState('')


async function submit(e){
e.preventDefault()
setMsg('')
try{
const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/register', {
method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({email})
})
const data = await res.json()
if(res.ok) setMsg('登録しました。')
else setMsg(data?.error || 'エラー')
}catch(err){
console.error(err)
setMsg('サーバーに接続できません。')
}
}


return (
<form onSubmit={submit} style={{width:'100%', maxWidth:480, display:'flex', gap:8}}>
<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="メールアドレス登録" className="rounded px-3 py-2 text-black" required />
<button className="rounded px-3 py-2 bg-slate-700" type="submit">登録</button>
<div className="small-muted" style={{alignSelf:'center'}}>{msg}</div>
</form>
)
}
