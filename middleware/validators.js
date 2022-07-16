const validateEmail = (emailStr) => {
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    return filter.test(emailStr);
}

const validatePhone = (phoneStr) => {
    const filter = /\+1\s\(\d{3}\)\s\d{3}\-\d{4}/;

    return filter.test(phoneStr);
}

module.exports = { validateEmail, validatePhone };
