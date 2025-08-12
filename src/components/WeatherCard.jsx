import React from 'react'

const SunIcon = ({size=64}) => (
  <svg className="icon-green" width={size} height={size} viewBox="0 0 64 64" fill="none" strokeWidth="3">
    <circle cx="32" cy="32" r="12" stroke="#22d500"/>
    {Array.from({length:8}).map((_,i)=>{
      const a = (i*45)*Math.PI/180;
      const x1 = 32 + Math.cos(a)*20, y1 = 32 + Math.sin(a)*20;
      const x2 = 32 + Math.cos(a)*28, y2 = 32 + Math.sin(a)*28;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d500" strokeLinecap="round"/>
    })}
  </svg>
)

const CloudIcon = ({size=64}) => (
  <svg className="icon-green" width={size} height={size} viewBox="0 0 64 64" fill="none" strokeWidth="3">
    <path d="M20 42h24a10 10 0 0 0 0-20 14 14 0 0 0-26-4A10 10 0 0 0 20 42z" stroke="#22d500" strokeLinejoin="round"/>
  </svg>
)

const RainIcon = ({size=64}) => (
  <svg className="icon-green" width={size} height={size} viewBox="0 0 64 64" fill="none" strokeWidth="3">
    <path d="M20 34h24a10 10 0 0 0 0-20 14 14 0 0 0-26-4A10 10 0 0 0 20 34z" stroke="#22d500" strokeLinejoin="round"/>
    <line x1="22" y1="42" x2="22" y2="54" stroke="#22d500" strokeLinecap="round"/>
    <line x1="32" y1="42" x2="32" y2="56" stroke="#22d500" strokeLinecap="round"/>
    <line x1="42" y1="42" x2="42" y2="54" stroke="#22d500" strokeLinecap="round"/>
  </svg>
)

const Mini = ({type}) => {
  const Comp = type==='rain'?RainIcon: type==='cloud'?CloudIcon: SunIcon
  return <Comp size={24}/>
}

export default function WeatherCard({city='–', temp='–', description='–', icon='sun', week=[]}){
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-xl font-semibold">{city}</div>
          <div className="text-4xl font-bold text-[color:var(--brand)]">{typeof temp==='number'? Math.round(temp)+'°' : temp}</div>
          <div className="muted capitalize">{description}</div>
        </div>
        <div className="ml-auto">
          {icon==='rain'? <RainIcon/> : icon==='cloud'? <CloudIcon/> : <SunIcon/>}
        </div>
      </div>
      {week.length>0 && (
        <div className="mt-4 grid grid-cols-7 gap-2 place-items-center">
          {week.map((d,idx)=> (
            <div key={idx} className="flex flex-col items-center text-sm">
              <Mini type={d.icon}/>
              <div className="muted">{d.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
