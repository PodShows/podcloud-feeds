const notEmpty = function(obj) {
    return (typeof obj === "string" && obj.length > 0);
};

export default { notEmpty };