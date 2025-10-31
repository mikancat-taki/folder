import React, {useState} from 'react'


export default function FolderCard({folder, onUpdate, onDelete}){
const [editing, setEditing] = useState(false)
const [name, setName] = useState(folder.name)


function save(){
onUpdate({name})
setEditing(false)
}


return (
<div className="folder-card" draggable>
<div style={{display:'flex', gap:8, alignItems:'center', width:'100%'}}>
<div style={{width:28, height:28, borderRadius:6, background: folder.color}} />
<div style={{flex:1}}>
{editing ? (
<input value={name} onChange={e=>setName(e.target.value)} className="text-black px-1 py-1 rounded" />
) : (
<div style={{fontWeight:600}}>{folder.name}</div>
)}
<div className="small-muted">{(folder.items||[]).length} items</div>
</div>
<div style={{display:'flex', gap:8}}>
{editing ? (
<>
<button onClick={save} className="px-2 py-1 rounded">Save</button>
<button onClick={()=>{setEditing(false); setName(folder.name)}} className="px-2 py-1 rounded">Cancel</button>
</>
) : (
<>
<button onClick={()=>setEditing(true)} className="px-2 py-1 rounded">Edit</button>
<button onClick={onDelete} className="px-2 py-1 rounded">Del</button>
</>
)}
</div>
</div>
</div>
)
}
