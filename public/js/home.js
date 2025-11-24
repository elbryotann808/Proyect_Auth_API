console.log("page home");

const logoutBtn = document.getElementById("logout")
const dateNowBtn = document.getElementById("dateNow")
const dataUserBtn = document.getElementById("dataUser")

const resultEl = document.getElementById("apiResult")

if (!logoutBtn) {
   console.warn("Element #logout not found in the DOM");
}

logoutBtn.addEventListener("click", async(e)=>{
  e.preventDefault()

  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST"
    })

    const jsonRes = await res.json()
    console.log(jsonRes);
    
    if (res.ok) {
      window.location.replace("/login")
    } else{
      if (resultEl) {
        resultEl.innerHTML = 
        `
        <div>
          <p>${jsonRes.message}</p>
        </div>
        `
      }else{
        console.warn("Element #apiResult not found in the DOM");
      }
    }
  } catch (error) {     
    console.error("Network/index error:", error)
  }
})


if (!dateNowBtn) {
  console.warn("Element #dateNow not found in the DOM");
}

dateNowBtn.addEventListener("click", async(e)=>{
  e.preventDefault()

  try {
    const res = await fetch("/api/auth/connection")
    const jsonRes = await res.json()

    console.log(jsonRes);
    if (!resultEl) return console.warn("Element #apiResult not found in the DOM")


    resultEl.innerHTML = 
    `
      <pre>${JSON.stringify(jsonRes, null, 4)}</pre>
    `
  } catch (error) {
    console.error("Network/index dateNow error:", error)
  }
})


if (!dataUserBtn) {
  console.warn("Element #dataUser not found in the DOM");
}

dataUserBtn.addEventListener("click", async(e)=>{
  e.preventDefault()
  try {
    const res = await fetch("api/auth/me")
    const jsonRes = await res.json()

    console.log(jsonRes);
    if (!resultEl) return console.warn("Element #apiResult not found in the DOM")

    resultEl.innerHTML = 
      `
        <pre>${JSON.stringify(jsonRes, null, 4)}</pre>
      `
  } catch (error) {
    console.error("Network/index dataUser error:", error)
  }
})