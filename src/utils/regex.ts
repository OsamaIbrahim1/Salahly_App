export const emailRegex = new RegExp(
    /[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/
)

export const phoneRegex = new RegExp(
    /^01[0125][0-9]{8}$/
)

export const passwordRegex = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/
);

export const arabicNameRegex = new RegExp(
    /^(?=.{10,})[\u0600-\u06FF]+(?: [\u0600-\u06FF]+)*(?: [\u0600-\u06FF]+)?$/
);

export const englishNameRegex = new RegExp(
    /^(?=.{10,})[A-Z][a-zA-Z'’\-]* (?:[a-zA-Z'’\-]* )*[a-zA-Z'’\-]*$/
);