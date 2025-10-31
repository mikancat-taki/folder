import React, {useState, useEffect} from 'react'
import Clock from './components/Clock'
import FolderGrid from './components/FolderGrid'
import EmailRegister from './components/EmailRegister'


export default function App(){
const [folders, setFolders] = useState([])


useEffect(()=>{
// load from localStorage (quick fallback). IndexedDB handled inside FolderGrid when needed.
const raw = localStorage.getItem('vf_folders')
if(raw){
try{ setFolders(JSON.parse(raw)) }catch(e){}
} else {
// sample starter folders
setFolders([
{id: 'inbox', name: 'Inbox', color:'#60a5fa', items:[]},
{id: 'work', name: 'Work', color:'#f97316', items:[]},
{id: 'personal', name: 'Personal', color:'#34d399', items:[]}
])
}
}, [])


useEffect(()=>{
localStorage.setItem('vf_folders', JSON.stringify(folders))
}, [folders])


return (
<div className="app-container">
<div className="clock-card">
<Clock />
<div className="small-muted">VirtualFolder — compact, customizable.</div>
</div>


<div style={{width:'100%', maxWidth:960}}>
<FolderGrid folders={folders} setFolders={setFolders} />
</div>


<EmailRegister />


</div>
)
}
