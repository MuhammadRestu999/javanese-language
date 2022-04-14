## Javanese Programming Language

Javanese Programming Language is a new programming language, easy to learn, using Jawa/Javanese language

### Instalation & Run

```bash
npm install -g javanese-language

// run
javanese example/example1.javanese
```

### Table Of Content
[TOC]

### Example 

Example : 

```
nyetel umur iku 13
yen(umur ndhuwur utawa padha karo 18) nuduhake teks "Akses ditampa"
yen ora nuduhake teks "Akses ditolak"
```

## Command

Some commands are just like javascript, the difference is the keywords and the javanese-script language will be translated to javascript and run as javascript, this is just for fun :D

#### Variable

Assign variable
```
nyetel foo iku "bar"
// let foo = "bar"
```

Reassign variable
```
ganti foo dadi "Hello World"
// foo = "Hello World"
```

**Boolean**

```
nyetel foo iku nggih
// let foo = true

nyetel bar dadi ora
// let bar = false
```

#### Print / Console.log
```
nuduhake teks "Hello world"
// console.log("Hello world")

nuduhake teks foo
// console.log(foo)
```


#### Condition

```
yen(foo padha karo "Hello world")
  nuduhake teks "Hello"
rampung

// transform to
if(foo == "Hello world"){
  console.log("Hello")
}
```

```
yen(foo ndhuwur 3)
  nuduhake teks "its bigger than 3"
utawa(fo padha karo 3)
  nuduhake teks "foo is 3"
yen ora
  nuduhake teks "its smaller than 3"
rampung

// transform to
if(foo > 3){
  console.log("its bigger than 3")
} else if (foo == 3) {
  console.log("foo is 3")
} else {
  console.log("its smaller than 3")
}
```

Comparison : 
- `padha karo`: ' == ',
- `ndhuwur`: ' > ',
- `ngisor`: ' < ',
- `luwih gedhe utawa padha karo`: ' >= ',
- `kurang saka utawa padha karo`: ' <= '

#### Loop

```
baleni(i saka 1 nganti 10)
  yen(i ndhuwur 3)
    nuduhake teks "loop " + i
  rampung
rampung

// transform to
for(let i = 0; i < 10; i++) {
  if(i > 3) {
    console.log("loop " + i)
  }
}
```

#### Function
```
fungsi hello(name)
  nuduhake teks "Hello " + name
  ngasilaken nggih
rampung
mbukak hello args "john"

// transform to
function hello(name) {
  console.log("Hello " + name)
  return true
}
hello("john")
```

#### Try Catch & Exception
```
coba
  nuduhake teks "Something wrong"
  uncal new Error("Error message")
nyekel
  nuduhake teks "Catch error"
pungkasanipun
  nuduhake teks "finish finally"
rampung

// transform to
try {
  console.log("Something wrong");
  throw new Error("Error message");
} catch {
  console.log("Catch error");
} finally {
  console.log("finish finally");
} 
```

#### Disclaimer

This project is just for fun
