function userdto({_id,name,email,phone,category,role}) {
    return {
        id: _id,
        name,
        email,
        phone,
        category,
        role,
    }
}

module.exports = {userdto}