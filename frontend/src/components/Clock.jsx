import React, {useState, useEffect} from 'react'


export default function Clock(){
const [now, setNow] = useState(new Date())
useEffect(()=>{
const t = setInterval(()=> setNow(new Date()), 1000)
return ()=> clearInterval(t)
}, [])


const hh = String(now.getHours()).padStart(2,'0')
const mm = String(now.getMinutes()).padStart(2,'0')
const ss = String(now.getSeconds()).padStart(2,'0')


return (
<div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
<div style={{fontSize:48, fontWeight:700}}>{hh}:{mm}</div>
<div style={{fontSize:14, opacity:0.8}}>{now.toLocaleDateString()} • {ss}</div>
</div>
)
}
