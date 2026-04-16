const form = document.querySelector('#contact')
const submitButton = document.querySelector('#submit')

form.addEventListener('submit', (e) =>{
    submitButtom.disabled = true
    e.preventDefualt()
    window.Location.href = 'success.html'
})