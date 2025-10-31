import React, {useState} from 'react'
import FolderCard from './FolderCard'


export default function FolderGrid({folders, setFolders}){
const [newName, setNewName] = useState('')


function addFolder(){
if(!newName.trim()) return
const id = `f_${Date.now()}`
setFolders([...folders, {id, name: newName.trim(), color: '#60a5fa', items:[]}])
setNewName('')
}


function updateFolder(id, patch){
setFolders(folders.map(f=> f.id===id ? {...f, ...patch} : f))
}


function deleteFolder(id){
setFolders(folders.filter(f=> f.id!==id))
}


return (
<div>
<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
<div style={{fontWeight:600}}>Folders</div>
<div style={{display:'flex', gap:8}}>
<input value={newName} onChange={e=>setNewName(e.target.value)} className="rounded px-2 py-1 text-black" placeholder="New folder" />
<button onClick={addFolder} className="rounded px-3 py-1 bg-slate-700">Add</button>
</div>
</div>


<div className="folder-grid">
{folders.map(f=> (
<FolderCard key={f.id} folder={f} onUpdate={(patch)=>updateFolder(f.id, patch)} onDelete={()=>deleteFolder(f.id)} />
))}
</div>
</div>
)
}
