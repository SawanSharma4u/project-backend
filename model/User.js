class User{
    constructor(fullName, email, password, defaultPassword, mobile){
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.defaultPassword = defaultPassword
        this.mobile = mobile;
    }

    toString(){
        return `"${this.fullName}","${this.email}","${this.password}","${this.defaultPassword}","${this.mobile}"`
    }
}
module.exports = User; 