import React from 'react'


export default function RecommendationCard({ title, details }){
return (
<div className="p-3 border rounded">
<h4 className="font-medium">{title}</h4>
<p className="text-sm text-slate-600">{details}</p>
</div>
)
}