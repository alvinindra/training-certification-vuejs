# Training Certification Vue.js Developer - Chapter 1: Vue.js Essentials
## Description

- Pada chapter ini membahas tentang esensi dari Vue.js itu sendiri, dimulai dengan bagaimana cara menggunakan vue.js di awal dengan menginstall menggunakan `npm` .

## Bootstrap a Vue App

- Memulai membangun aplikasi Vue dengan menginstallnya dengan `npm install vue@latest`.
- Install dependencies nya dari package.json
- Lalu menjalankannya di local development.

## Reactivity Fundamentals

### Declaring Reactive State

Di dalam **************************Composition API************************** disarankan ketika melakukan deklarasi reactive state itu menggunakan `ref()` function

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` bisa mengambil argumen dan mengembalikannya yang dibungkus dengan sebuah ref object dengan sebuah `.value` properti.

```js
const count = ref(0);

// Akan mengembalikan ref object

console.log(count); // { value: 0 }

// Harus memanggil properti `value` untuk mengembalikan nilai aslinya.

console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

Cara akses di atas hanya berlaku di block `<script>`. Ketika refs ingin diakses dalam templat komponen, kita perlu melakukan exposing refs dari hook `setup`.

Caranya: deklarasikan dan kembalikan objek ref dalam method komponen bernama `setup()`.

```js
import { ref } from 'vue'

export default {
  // `setup` is a special hook dedicated for the Composition API.
  setup() {
    const count = ref(0);

    // expose the ref to the template
    return {
      count,
    };
  }
}
```

Method `setup` di atas adalah method khusus yang diperuntukkan untuk Composition API. Jadi, kita ingin menerapkan Composition API, bisa memanfaatkan method ini.

> Penulis (@Nur Rizki Adi Prasetyo) masih bertanya-tanya apakah mendeklarasikan komponen dengan object bisa memanfaatkan Composition API?

Apakah jika menggunakan `<script setup>` sudah dipastikan memanfaatkan Composition API?
> 

Berikut contoh akses ref pada templat komponen.

```js
<div>{{ count }}</div>
```

Ini juga berlaku jika menerapkannya pada inline event handlers.

<aside>
💡 **Catatan:**
Kita **tidak** perlu menambahkan `.value` ketika memanggil ref pada template. Ini karena vue melakukan unwrapping ref object. Demi kemudahan, refs otomatis terbuka ketika menggunakannya di dalam template.

</aside>

Cara di atas memang sangat memudahkan kita. Namun, ada beberapa catatan tambahan. Rinciannya bisa diakses di [Caveat when Unwrapping in Templates](https://vuejs.org/guide/essentials/reactivity-fundamentals#caveat-when-unwrapping-in-templates).

### `<script setup>`

Secara manual, mengekspos state dan methods bisa dilakukan dengan mendaftarkannya dalam return value (JavaScript object) dari method `setup()`. Namun, manually exposing state and methods via `setup()` bisa berulang-ulang dan merepotkan, bukan? Untungnya, itu bisa dihindari dengan **[Single-File Components (SFCs)](https://vuejs.org/guide/scaling-up/sfc)**. Kita bisa mempermudahnya menggunakan `<script setup>`:

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

Seluruh unit seperti top-level import, variable, dan function yang di deklarasikan dalam `<script setup>` akan bisa digunakan di dalam template komponen secara otomatis tanpa perlu mendaftarkannya sebagai return value. Memikirkan template sebagai di sebuah fungsi JavaScript dideklarasikan di scope yang sama - itu secara natural bisa mengakses semuanya yang terdeklarasi didalamnya.

### Alasan Menggunakan .value

Sebelum ke arah sana, ada baiknya kita mengetahui sistem reactivity ini diterapkan dalam vue.

Setiap kali memanfaatkan ref obejct dalam template, mungkin kita melihat perubahan secara langsung di hadapan user. Ini terjadi karena Vue melakukan pendeteksian perubahan nilai pada ref dan memperbarui DOM yang sesuai. Ini mungkin dilakukan karena ada pelacakan dependencies berdasarkan sistem reactivity. Saat komponen dirender untuk pertama kalinya, Vue akan melacak setiap ref yang dimanfaatkan dalam template selama proses rendering. Nantinya, saat nilai ref diubah, perubahan ini akan memicu Vue untuk melakukan render ulang bagi komponen yang melacaknya. Dengan kata lain, jika terjadi perubahan ref pada komponen A, Vue akan melakukan re render komponen tersebut.

Sampai di sini sudah jelas, properti value diperlukan Vue untuk mendapatkan kesempatan untuk mendeteksi perubahan yang terjadi.

### Reactivity yang Mendalam

Sebenarnya, ref dapat menyimpan tipe nilai apa pun, termasuk nested object, array, atau struktur data bawaan JavaScript seperti Map.

Ref akan membuat nilai yang mendalam tersebut menjadi reactive. Ini artinya, kita dapat mengharapkan terdeteksinya perubahan meskipun perubahan nilai terjadi pada object atau array yang dalam.

Value Non-primitive akan dijadikan sebagai reactive proxies melalui [reactive()](https://vuejs.org/guide/essentials/reactivity-fundamentals#reactive). 

Bagaimana kalau tidak mengharapkan deep reactivity pada non-primitive values? Ada caranya dengan [shallow ref](https://vuejs.org/api/reactivity-advanced#shallowref). 

```js
const shallowArray = shallowRef([
  /* big list of deep objects */
])

// this won't trigger updates...
shallowArray.value.push(newObject)
// this does:
shallowArray.value = [...shallowArray.value, newObject]

// this won't trigger updates...
shallowArray.value[0].foo = 1
// this does:
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

```js
const state = shallowRef({ count: 1 })

// does NOT trigger change
state.value.count = 2

// does trigger change
state.value = { count: 2 }
```

Shallow ref biasanya diterapkan untuk pertimbangan performa dan integrasi extenal management state (library lain yang ingin mengatur inner state dari object).

### DOM Update Timing

Update komponen terjadi setelah “next tick”. Apa artinya? Jadi, Vue akan menahan perubahan yang tampak pada user (UI) hingga global API, nextTick(), dijalankan.

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Now the DOM is updated
}
```

Perlu dicatat bahwa memang `nextTick` akan menentukan updatenya DOM. Namun, ini bukan berarti bahwa ref belum up-to-date.

### `reactive()`

Ada cara lain untuk mendeklarasikan reactive state, yaitu dengan `reactive()` API. Tidak seperti ref yang membungkus inner value dalam sebuah object khusus, `reactive()` sebetulnya membuat object itu sendiri menjadi reaktif.

Reactive object adalah [JavaScript Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) dan berperilaku seperti object pada umumnya. Perbedaannya, Vue dapat melakukan pencegatan akses dan pengubahan semua properti dari sebuah reactive object.

Oya, satu hal lagi. Mirip dengan shallow ref, ada shallow reactive untuk mencegah reaktivitas yang mendalam.

### Reactive Proxy vs. Original Object

Penting untuk dicatat bahwa return dari `reactive()` adalah [Proxy](https://www.notion.so/Training-Certification-Vue-js-Developer-Chapter-1-Vue-js-Essentials-6521301822274be7ad606cf17294ec10?pvs=21) dari object asli. Yang mana itu tidak mirip dengan object yang asli.

```js
const raw = {};
const proxy = reactive(raw);

// proxy is NOT equal to the original.
console.log(proxy === raw); // false
```

Hanya proxy yang reactive. Mengubah object asli tidak akan memicu update. Oleh karena itu, praktik terbaik ketika bekerja dengan sistem reactivity pada Vue adalah gunakan versi object yang telah di-proxy-kan dari state kamu.

Untuk memastikan akses konsistensi pada proxy, memanggil `reactive()` pada object yang sama akan mengembalikan proxy yang sama. Selain itu, memanggil `reactive()` pada proxy yang sudah akan mengembalikan proxy yang sama juga.

```js
// calling reactive() on the same object returns the same proxy
console.log(reactive(raw) === proxy) // true

// calling reactive() on a proxy returns itself
console.log(reactive(proxy) === proxy) // true
```

Aturan ini diterapkan pada nested object juga. Karena deep reactivity, nested object di dalam reactive object juga sebuah proxy.

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Kekurangan dari `reactive()`

Beberapa limitasi dari `reactive()` sebagai berikut.

- **Hanya mendukung non-primitive value** seperti object, array, dan beberapa [collection yang memanfaatkan key](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) seperti [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) dan [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).
- **Tidak dapat menggantikan object keseluruhan:** karena reactivity tracking milik Vue bekerja di atas property access, kita harus selalu menjaga kesamaan reference pada reactive object. Artinya, kita tidak dapat dengan mudah mengganti sebuah reactive object karena koneksi reactivity sebelumnya menjadi hilang.

```js
let state = reactive({ count: 0 })

// the above reference ({ count: 0 }) is no longer being tracked
// (reactivity connection is lost!)
state = reactive({ count: 1 })
```

- **Tidak bisa memanfaatkan destructuring:** saat melakukan destructuring dari nilai properti yang merupakan primitive type dari sebuah reactive object, atau melakukan assigning sebagai argument parameter dari sebuah function, kita akan kehilangan reactivity connection.

```js
const state = reactive({ count: 0 });

// count is disconnected from state.count when destructured.
let { count } = state;
// does not affect original state
count++;

// the function receives a plain number and
// won't be able to track changes to state.count
// we have to pass the entire object in to retain reactivity
callSomeFunction(state.count);
```

Beberapa limitasi ini menyebabkan tim Vue merekomendasikan `ref()` sebagai API utama dalam mendeklarasikan reactive state.

### Tambahan Rincian Tentang Unwrapping pada Ref

**Saat Menjadi Reactive Object**

Secara otomatis, ref akan unwrapped saat diakses atau diubah ketika sudah menjadi properti yang reactive object (`reactive()`). Dengan kata lain, object ref menjadi dapat diakses seperti properti pada umumnya (unwrapped).

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Meskipun demikian, `state.count` tetap terhubung dengan object ref tersebut.

Namun, jika sebuah object ref baru di-assign atau diberikan pada object property yang terhubung dengan object ref sebelumnya, object ref baru tersebut akan menggantikan posisi object ref yang lama. 

```js
const otherCount = ref(2);

state.count = otherCount;
console.log(state.count); // 2
// original ref is now disconnected from state.count
console.log(count.value); // 1
```

> Catatan:
Ini hanya berlaku bagi nested object yang berada dalam reactive object. Reactive object dengan shallow reactive object tidak akan menerapkan hal tersebut ketika diakses. Dengan kata lain, object ref tidak unwrapped.
> 

**Peringatan dalam Array dan Collection**

Tudaj seperti reactive objects, tidak ada proses unwrapping yang dilakukan saat ref di akses saat berada dalam reactive array atau reactive collection type seperti Map:

```js
const books = reactive([ref('Vue 3 Guide')]);

// need .value here
console.log(books[0].value);

const map = reactive(new Map([['count', ref(0)]]));

// need .value here
console.log(map.get('count').value);
```

**Peringatan saat Unwrapping dalam Template**

Memang, Ref akan melakukan unwrapping dalam template. Namun, ini hanya berlaku jika ref object berada dalam top-level property dalam template render context.

Dalam contoh di bawah, `count` dan `object` adalah top lavel properties, tetapi `object.id` tidak demikian.

```js
const count = ref(0);
const object = { 
	id: ref(1),
};
```

Kode berikut sebenarnya bekerja seperti yang diharapkan.

```js
{{ count + 1 }}
```

… sementara, kode yang satu ini tidak demikian:

```js
{{ object.id + 1 }}
```

Hasil render yang terjadi adalah `[object Object]1` karena [object.id](http://object.id) tidak di unwrapped oleh Vue ketika mengevaluasi expession dan properti tersebut masih dalam bentuk object ref.

Ini dapat diatasi tentunya. Salah satunya adalah melakukan destructuring object agar menjadi top level property.

```js
const { id } = object;
```

Sekarang kita bisa pakai <code v-pre>{{ id + 1 }}</code> dan akan menghasilkan `2`.

Hal lain yang perlu dicatat juga adalah ref akan di-unwrap jika itu adalah evaluasi value terakhir dari text interpolation (<code v-pre>{{}}</code>), sehingga kode berikut akan menghasilkan `1`.

Ada tambahan catatan lain yang perlu diperhatikan. Object ref yang bukan top-level properties memang tidak unwrapped oleh Vue. Namun, ada pengecualian lain. Object ref yang bukan top-level properties dapat unwrapped ketika ia adalah hal terakhir yang akan dievaluasi oleh text interpolation.

```js
{{ object.id }}
```

Ini hanyalah fitur kenyamanan saja dari text interpolation dan hasilnya tentu akan sama dengan <code v-pre>{{ object.id.value }}</code>.

> **Catatan:**
Contoh di atas adalah object JavaScript. Ini juga berlaku bagi object type lainnya seperti Array dan Collection seperti Map dan Set.
> 

## Composition API FAQ

Composition API adalah kumpulan beberapa API yang memungkinkan kita membuat komponen Vue menggunakan fungsi yang diimport alih-alih mendeklarasikan opsi. Ini adalah beberapa istilah umum yang mencakup API berikut.

- **[Reactivity API](https://vuejs.org/api/reactivity-core)**, Contoh: `ref()` dan `reactive()`, yang memungkinkan kita membuat reactive state computed state, dan watchers.
- **[Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle)**, Contoh: `onMounted()` dan `onUnmounted()`, yang memungkinkan kita terhubung ke lifycycle komponen secara terprogram.
- **[Dependency Injection](https://vuejs.org/api/composition-api-dependency-injection)**, Contoh: `provide()` dan `inject()`, yang memungkinkan kita memanfaatkan sistem dependency injection Vue saat menggunakan Reactivity APIs.

### Kenapa Composition API?

- **Better Logic Reuse** (Logic mudah digunakan kembali)
- ******More Flexible Code Organization****** (Lebih fleksibel dalam mengorganisasikan kode)
- ****Better Type Inference****
- ****Smaller Production Bundle and Less Overhead****

### **Apakah Composition API mencakup semua kasus penggunaan?**

YYa dalam hal logika stateful. Saat menggunakan Composition API, hanya ada beberapa opsi yang mungkin masih diperlukan:`props`, `emits`, `name`, and `inheritAttrs`.

<aside>
💡 **TIP**

**Semenjak 3.3 kamu bisa langsung menggunakan `defineOptions` di `<script setup>` untuk set nama komponen atau properti `inheritAttrs`.**

</aside>

### **Bisakah menggunakan kedua API dalam komponen yang sama?**

Ya. Kamu dapat menggunakan Composition API melalui option `setup()` di komponen Options API.

Namun, kami hanya menyarankan kamu untuk melakukan hal ini jika kamu sudah memiliki codebase Options API sebelumnya yang perlu diintegrasikan dengan fitur baru/library eksternal yang ditulis dengan Composition API.

## Template Syntax

Vue menggunakan sintaks templat berbasis HTML yang memungkinkan kamu mengikat DOM yang dirender secara deklaratif ke instance data komponen yang mendasarinya. Semua template Vue adalah HTML yang valid secara sintaksis dan dapat diurai oleh browser dan parser HTML yang memenuhi spesifikasi.

Di balik sistemnya, Vue mengkompilasi template menjadi kode JavaScript yang sangat optimal. Dikombinasikan dengan reactivity sistem, Vue dapat dengan cerdas mengetahui jumlah minimal komponen yang perlu dirender ulang dan menerapkan manipulasi DOM dalam jumlah minimal ketika app state berubah.

Jika kamu familiar dengan konsep Virtual DOM dan lebih menyukai kekuatan pure JavaScript, Kamu juga dapat langsung menulis fungsi render alih-alih templat, dengan dukungan opsional js. Namun, perhatikan bahwa mereka tidak menikmati tingkat optimasi waktu compile yang sama seperti templat.

### Interpolate text with HTML

Bentuk data binding yang paling dasar adalah interpolasi teks menggunakan sintaks "Mustache" (kurung kurawal ganda):

```js
<span>Message: {{ msg }}</span>
```

Tag mustache akan diganti dengan nilai properti msg dari instance komponen yang sesuai. Ini juga akan diperbarui setiap kali properti pesan berubah.

### Bind data to attributes

Mustaches tidak dapat digunakan di dalam atribut HTML. Sebagai gantinya gunakan 

**`[v-bind` directive](https://vuejs.org/api/built-in-directives#v-bind)**:

- ************Shorthand************
    
    Karena `v-bind` sangat umum digunakan, ia mempunyai sintaks singkatan khusus:
    
    ```vue
    <div :id="dynamicId"></div>
    ```
    
    Atribut yang dimulai dengan `:` mungkin terlihat sedikit berbeda dari HTML biasa, namun sebenarnya ini adalah karakter yang valid untuk nama atribut dan semua browser yang mendukung Vue dapat menguraikannya dengan benar. Selain itu, mereka tidak muncul di final rendered markup. Sintaks singkatannya bersifat opsional, tetapi Anda mungkin akan berterimakasih saat mempelajari lebih lanjut penggunaannya nanti.
    

### And use built in directives to render HTML based on your reactive data

Directives are special attributes with the `v-` prefix. Vue provides a number of **[built-in directives](https://vuejs.org/api/built-in-directives)**, including `v-html` and `v-bind` which we have introduced above.

Directive attribute values are expected to be single JavaScript expressions (with the exception of `v-for`, `v-on` and `v-slot`, which will be discussed in their respective sections later). A directive's job is to reactively apply updates to the DOM when the value of its expression changes. Take **`[v-if](https://vuejs.org/api/built-in-directives#v-if)`** as an example:

```vue
<p v-if="seen">Now you see me</p>
```

Here, the `v-if` directive would remove / insert the `<p>` element based on the truthiness of the value of the expression `seen`.

## **Event Handling**

### The difference between inline and method handlers

- ****Inline Handlers****
    
    Inline handlers biasanya digunakan dalam kasus sederhana, misalnya:
    
    ```vue
    const count = ref(0)
    ```
    
    ```vue
    <button @click="count++">Add 1</button>
    <p>Count is: {{ count }}</p>
    ```
    
- ****Method Handlers****
    
    Logic untuk banyak event handlers akan lebih kompleks, dan kemungkinan besar tidak dapat dilakukan dengan inline handlers. Oleh karena itu `v-on` dapat menerima nama atau jalur metode komponen yang ingin kamu panggil.
    
    Untuk contoh:
    
    ```js
    const name = ref('Vue.js')
    
    function greet(event) {
      alert(`Hello ${name.value}!`)
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName)
      }
    }
    ```
    
    ```vue
    <!-- `greet` is the name of the method defined above -->
    <button @click="greet">Greet</button>
    ```
    
- **Method vs. Inline Detection[](https://vuejs.org/guide/essentials/event-handling.html#method-vs-inline-detection)**
    
    Compiler template mendeteksi pengendali metode dengan memeriksa apakah string nilai `v-on` adalah JavaScript identifier atau property acess path yang valid. Misalnya, `foo`, `foo.bar`, dan `foo['bar']` diperlakukan sebagai penangan metode, sedangkan `foo()` dan `count++` diperlakukan sebagai inline handlers.
    

### How to access the event object

### And how to modify the event with modifiers.

---

## Quiz

1. ****What does the following code do?****
    
    ```js
    createApp({}).mount("#app")
    ```
    
    a. Adds the Vue.js library to a project
    
    b. Mounts a Vue component to a parent component called app
    
    c. **Creates an application instance and mounts it to the DOM (TRUE)**
    
    d. Defines a reactive variable called app
    
2. ****What is the CLI command to create a new Vue.js SPA with the official Vue project scaffolding tool (create-vue)?****
    1. `vue create my-project`
    2. `npm create vue-project`
    3. `npm init vue@latest`  ************(TRUE)************
    4. `vue-cli init my-project`
3. ****Which of the following are limitations of the reactive function? (Choose ALL that apply)****
    
    a. It has no limitations
    
    **b. You cannot destructure it's properties and have them remain reactive (TRUE)**
    
    c. It only works for booleans, strings, and numbers
    
    **d. It only works for object types (TRUE)**
    
4. ****When is it necessary to use .value?****
    1. When accessing the value of data declared with `reactive()`
    2. **When setting the value of a ref in the script section (TRUE)**
    3. When accessing the value of a ref in the template
    4. When using v-if conditionally render an element
5. ****What is the shorthand for v-bind?****
    1. **a colon (:) (TRUE)**
    2. an ampersand (&)
    3. a semicolon (;)
    4. a question mark (?)
6. ****What is the rendered HTML for the following code block?****
    
    ```vue
    <script setup>
    const html = "<p></p>";
    </script>
    <template>
    
    <div>
      {{ html }}
    </div>
    </template>
    ```
    
    a. `<div><p></p></div>`
    
    b. `<div>&lt;p&gt;&lt;/p&gt;</div>` ************(TRUE)************
    
    c. `<p></p>`
    
    d. `<div><span></span></div>`
---
## Create a Movie Rating App

[Movie Rating App](https://github.com/alvinindra/training-certification-vuejs/tree/1-1-create-a-rating-movie-app/movie-rating-app)