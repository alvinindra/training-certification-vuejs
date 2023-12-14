## Watcher

TO BE CONTINUED

## Template Ref

Berbeda dengan reaktivitas (reactivity), ref dalam konteks pembahasan ini adalah mendapatkan referensi elemen DOM yang dirender oleh component. Meskipun merupakan sebuah built-in function, ref juga sebuah atribut khusus di vue.js untuk mendapatkan object reference dari elemen yang dituju.

```html
<input ref="input">
```

Sudah selesai. Lalu, bagaimana cara mendapatkan object reference dari elemen di atas? Gunakan built-in function ref.

```js
import { ref, onMounted } from 'vue';

const input = ref(null);

onMounted(() => {
	// Object elemen didapatkan.
	console.log(input.value);
});

// Object elemen belum didapat alias mengembalikan `null`
console.log(input.value);
```

Perlu diingat bahwa meskipun tata cara kita sudah tepat, tetapi object elemen belum diperoleh. Saat component dalam proses render, variabel `input` masih bernilai `null`. Kita perlu menunggu hingga component diikat atau dipasang (mounted) sehingga object element diperoleh.

Jika kita memiliki kebutuhan menerapkannya di template atau sebagai expressions, variabel `input` akan null di kali pertama render. Lebih lanjut lagi, jika perlu mengakses elemen dalam `watch`, kita perlu mengantisipasinya dengan menggunakan percabangan.

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // not mounted yet, or the element was unmounted (e.g. by v-if)
  }
});
```

### Referensi dalam <code v-pre>v-for</code>

Mungkin terpikir oleh kita cara yang tepat untuk mengambil seluruh elemen yang dilakukan dalam perulangan, <code v-pre>v-for</code>. Apakah kita tetap pakai cara yang sama, yaitu memberi nama referensi yang sama untuk seluruh elemen yang di-*looping* atau memberikan nama referensi yang unik.

Yap, kita tetap lakukan seperti biasa. Berikan saja nama referensi yang sama. Hal yang membedakan adalah kita berikan array kosong sebagai nilai awal object <code v-pre>ref()</code>.

```js
import { ref, onMounted } from 'vue';

const inputList = [
	/*
		...,
		...,
		...,
		...,
		...,
  */
];

const inputRefs = ref([]);

onMounted(() => {
	// Object elemen didapatkan
	console.log('Di dalam event mounted');
	inputRefs.value.forEach((inputRef) => {
		console.log(inputRef);
	});
});

// Object elemen belum didapat alias mengembalikan `null`
console.log('Diluar event mounted');
inputRefs.value.forEach((inputRef) => {
	console.log(inputRef);
});
```

```vue
<input v-for="input in inputList" :key="input.id" ref="inputRefs" />
```

Hal di atas mirip dengan konsep sebelumnya.

**Notes:** hal yang perlu dicatat adalah ref array tidak menjamin urutan elemen yang sama seperti sumber array.

### Function Ref

Tidak hanya string yang dapat diberi, ref juga memungkinkan kita memberinya sebuah function yang akan dipanggil setiap kali terjadi pembaruan component (component update) dan memberikan fleksibilitas yang penuh dalam menyimpan element reference.

```vue
<script setup>
import { ref, onMounted } from 'vue';

const masukan = ref(null);

onMounted(() => {
	// Object elemen didapatkan.
	console.log(masukan.value);
});

// Object elemen belum didapat alias mengembalikan `null`
console.log(masukan.value);
</script>

<template>
  <input :ref="(element) => { masukan = element }" />
</template>
```

Perlu dicatat bahwa saat component dilepas, argument dari function akan menjadi <code v-pre>null</code>. Kita juga bisa menggunakan method ketimbang inline function.

### Ref on Component

Tidak hanya mendapatkan element reference, tentu kita memiliki kebutuhan mendapatkan component reference dan tentu ini bisa kita lakukan dengan cara yang tidak berbeda. 

```vue
<script setup>
import { ref, onMounted } from 'vue';
import Child from './Child.vue';

const child = ref(null);

onMounted(() => {
  // child.value will hold an instance of <Child />
});
</script>

<template>
  <Child ref="child" />
</template>
```

*Yup*, variabel `child` akan berisi component reference atau object reference dari component yang dituju.

Dari sini, kita seharusnya tidak bingung lagi jika paham dengan pelajaran sebelumnya. Tentu itu karena caranya sama. Namun, ada hal besar yang perlu kita perhatikan dalam masalah ini. Masalah ini terbagi menjadi dua sesuai dengan API yang didukung oleh vue.js, yaitu Options API dan Composition API.

- Options API
    - Sebetulnya, saat mendapatkan reference dari child component, parent component akan miliki akses yang penuh terhadapnya. Apa maksudnya? Jadi, seluruh method dan property yang didefine di child component dapat diakses penuh oleh parent component tanpa terkecuali.
    - Bahkan, seharusnya component yang diperoleh digunakan seperlunya saja. Dalam halaman dokumentasi vue.js tentang [Ref on Component](https://vuejs.org/guide/essentials/template-refs.html#:~:text=so%20component%20refs%20should%20be%20only%20used%20when%20absolutely%20needed%20%2D%20in%20most%20cases%2C%20you%20should%20try%20to%20implement%20parent%20/%20child%20interactions%20using%20the%20standard%20props%20and%20emit%20interfaces%20first.), sebaiknya kita gunakan props dan emits untuk berkomunikasi.
- Composition API
    - Sangat berbeda dengan Options API, Composition API atau <code v-pre>`<script setup>`</code> secara bawaan sudah privat. Ini menyebabkan parent element yang mendapatkan child component reference tidak dapat mengaksesnya begitu saja.
    - Oleh karena itu, asumsi kita adalah melakukan export, bukan? Nah, kita perlu mengekspos mereka dengan built-in function bernama `defineExpose`. Contoh:
    
    ```vue
    <script setup>
    import { ref } from 'vue';
    
    const a = 1;
    const b = ref(2);
    
    // Compiler macros, such as defineExpose, don't need to be imported
    defineExpose({
      a,
      b,
    });
    </script>
    ```
    
# Coming Soon