console.log("Page login");

const form = document.getElementById("loginForm")
const resultEl = document.getElementById("apiResult")

if (!form) {
  console.warn("Element #loginForm not found in the DOM");
} else{
    form.addEventListener("submit", async(e)=>{
    e.preventDefault()
  
    const email = form.email.value.trim()
    const password = form.password.value

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })  
      })
  
      const jsonRes = await res.json()
      console.log(jsonRes);
    
      if (res.ok) {
        window.location.replace("/")
      }else {  
        if (resultEl) {
          resultEl.innerHTML = 
          `
          <div class="form__error-response">
            <p>${jsonRes.message}</p>
          </div>
          `
        }else{
          console.warn("Element #apiResult not found in the DOM");
        }
      }
    } catch (error) {
      console.error("Network/login error:", error)
    }
  })
}
