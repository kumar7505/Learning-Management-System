import React from 'react'
import { Label } from "../ui/label";

function FormControls({formControls = [], fromData, setFormData}){
  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controleItem) => (
        <div key={controleItem.name}>
          <Label htmlFor={controleItem.name}>{controleItem.label}</Label>
          {renderComponentByType(controleItem)}
        </div>
      ))}
    </div>
  )
}

export default FormControls