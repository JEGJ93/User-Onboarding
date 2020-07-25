import React, { useState, useEffect } from 'react';
import * as yup from "yup";
import axios from "axios";

const Form = () => {

    const [user, setUser] = useState([]);
    const [serverError, setServerError] = useState("");

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        password: "",
        terms: false
      });


        const [ buttonDisabled, setButtonDisabled] =useState(true);


        const [errors, setErrors] = useState({
            name: "",
            email: "",
            password: "",
            terms: "",
          });

          const formSchema = yup.object().shape({
            name: yup.string().required("Name is a required field."), 
            email: yup
              .string()
              .email("Must be a valid email address.")
              .required("Must include email address."),
            password: yup.string().required("Password is a required field."), 
            terms: yup.boolean().oneOf([true], "please agree to terms of use"),
          });

          useEffect(() => {
            console.log('form state change')
            formSchema.isValid(formState).then(valid => {
              console.log('valid?', valid)
                    setButtonDisabled(!valid);
            });
          }, [formState]);



          const formSubmit = e => {
            e.preventDefault(); 
        
              axios.post("https://reqres.in/api/users", formState)
              .then(res => {
               
                setUser(res.data);
                console.log("successful API POST!");
        
            
                setFormState({
                  name: "",
                  email: "",
                  motivation: "",
                  positions: "",
                  terms: true
                });
        
                
                setServerError(null);
              })
              .catch(err => {
              
                setServerError("oops! something happened!");
              });
          };
        


          const validateChange = e => {
            
            yup
              .reach(formSchema, e.target.name)
              .validate(e.target.name === "terms" ? e.target.checked : e.target.value) 
              .then(inputIsValid => {
                setErrors({
                  ...errors,
                  [e.target.name]: ""
                });
              })
              .catch(err => {
                setErrors({
                  ...errors,
                  [e.target.name]: err.errors[0]
                });
              });
          };
        
          const inputChange = e => {
            e.persist(); 
            console.log("input changed!", e.target.value);
            console.log("checkbox change", e.target.checked);
            console.log("name of input that fired event", e.target.name); 
        
            let checkboxVal = true;
        
            if (e.target.name === "terms") {
              checkboxVal = e.target.checked;
            } else {
              checkboxVal = formState.terms;
            };
    
            const newFormData = {
            ...formState,
            terms: checkboxVal,
            [e.target.name]:
                e.target.name === "terms" ? e.target.checked : e.target.value 
            };
    
        validateChange(e); 
        setFormState(newFormData); 
      };

    //   const handleChanges = event => {
    
    //     setFormState({ ...formState, [event.target.name]: event.target.value});
    // };

    //   const submitForm = event => {
    //     event.preventDefault()
    //     props.newTeamMember(formState)
    //     setTheForm({name: '', email: '', password: '', terms})
    // }

 return (
    <form onSubmit={formSubmit} > 
        {serverError ? <p className="error">{serverError}</p> : null}
        <label htmlFor="name">
            Name
        <input id="name" type="text" placeholder="Enter Name" name="name" value={formState.name} onChange={inputChange}/> 
            {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
        </label>
        
        <label htmlFor="email">Email
        <input id="email" type='text' placeholder="Enter Email" name="email" value={formState.email} onChange={inputChange} />
        {errors.email.length > 0 ? (
          <p className="error">{errors.email}</p>
        ) : null}
        </label>

        <label htmlFor="password">
            Password
        <input id="password" type="text" placeholder="Enter Password" name="password" value={formState.password} onChange={inputChange} />
            {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
        </label>

        <label htmlFor="terms">
            Terms and Conditions
        <input id="terms" type="checkbox" checked={formState.terms} name="terms" onChange={inputChange}/>
            {errors.terms.length > 0 ? (<p className="error">{errors.terms}</p>) : null}
        </label>

        <div>
            <button type="submit" disabled={buttonDisabled}>Submit</button>
        </div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
    </form>
);

}; 



export default Form;


    // <form> 
    //     <label htmlFor="name">
    //         Name
    //     <input id="name" type="text" placeholder="Enter Name" name="name" /> 
    //     </label>
        
    //     <label htmlFor="email">Email</label>
    //     <input id="email" type='text' placeholder="Enter Email" name="email" />
        
    //     <label htmlFor="password">
    //         Password
    //     <input id="password" type="text" placeholder="Enter Password" name="password" />
    //     </label>

    //     <label htmlFor="term">
    //         Terms and Conditions
    //     <input id="term" type="checkbox" checked={true} name="term" />
    //     </label>

    //     <div>
    //         <button type="submit">Submit</button>
    //     </div>
    // </form>
