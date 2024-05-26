import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import axios from 'axios';

const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

const formSchema = yup.object().shape({
  fullName: yup.string().trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: yup.string()
    .oneOf(['S','M','L'], validationErrors.sizeIncorrect)
})

const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialValues = () => ({ fullName: "", size: "", toppings: []});
const initialErrors = () => ({ fullName: "", size: ""});

export default function Form() {
  //STATES
  const [values, setValues] = useState(initialValues());
  const [errors, setErrors] = useState(initialErrors());
  const [enabledSub, setEnabledSub] = useState(false);
  const [succSer, setSuccSer] = useState();
  const [failSer, setFailSer] = useState();
  //EFFECT
  useEffect(() => {
    formSchema.isValid(values).then(setEnabledSub)
  }, [values])
  //CHANGE
  const onChange = evt => {
    let { type, checked, name, value} = evt.target;
    if (type === 'checkbox') {
      setValues(prev => ({
        ...prev,
        toppings: checked
          ? [...prev.toppings, name]
          : prev.toppings.filter(t => t !== name)
      }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
      yup.reach(formSchema, name)
        .validate(value)
        .then(() => setErrors(prev => ({ ...prev, [name]: '' })))
        .catch(err => setErrors(prev => ({ ...prev, [name]: err.errors[0] })));
    }
  }
  //SUBMIT
  const onSubmit = evt => {
    evt.preventDefault()
    axios.post('http://localhost:9009/api/order', values)
      .then(res => {
        setValues(initialValues())
        setSuccSer(res.data.message)
        setFailSer()
      })
      .catch(err => {
        setFailSer(err.response.data.message)
        setSuccSer()
      })
  }
  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {succSer && <div className='success'>{succSer}</div>}
      {failSer && <div className='failure'>{failSer}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" name="fullName" type="text" onChange={onChange} value={values.fullName}/>
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" onChange={onChange} value={values.size}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name={topping.topping_id}
              type="checkbox"
              onChange={onChange}
              checked={values.toppings.includes(topping.topping_id)}
            />
            {topping.text}<br />
          </label>
        ))}
      </div>
      <input type="submit" disabled={!enabledSub}/>
    </form>
  )
}
