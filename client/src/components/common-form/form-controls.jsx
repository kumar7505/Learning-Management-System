import React from 'react'
import { Label } from "../ui/label";

function FormControls({formControls = [], fromData, setFormData}){
  function renderComponentByType(getControlItem) {  
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
          />
      )}
    }
  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controleItem) => (
        <div key={controleItem.name}>
          <Label htmlFor={controlItem.name}>{controleItem.label}</Label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  )
}

export default FormControls