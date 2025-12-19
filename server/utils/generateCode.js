const generateCode=(size)=>{
    const randNum=String(Math.random()).split('.')[1];

    const len=size ? size : 4;
    const randNumLen=randNum.length;
    let code='';

    for(let i=0;i<size;i++)
    {
        code=code+randNum[randNumLen-(i+1)];
    }

    return code;
}

module.exports=generateCode;