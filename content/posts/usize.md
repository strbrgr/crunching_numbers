---
title: Why do we need `usize` to index collections in Rust?
date: 2024-12-20
tags:
  - rust
---
During Advent of Code I ran into the following error:
```rust
error[E0277]: the type `[{integer}]` cannot be indexed by `i32`
```
This happened when I tried to access the index of a vector like in the following example:
```rust
let array = [1, 2, 3, 4, 5]; 
let index: i32 = 2;
// This won't compile:
let element = array.get(index);
```

Now why exactly can't we use a `i32` to index a collection? And what does the type `usize` represent?

## usize
The Rust documentation reads:

> This type describes the pointer-sized unsigned integer type and is used to index and measure memory. The size of this primitive is how many bytes it takes to reference any location in memory. For example, on a 32 bit target, this is 4 bytes and on a 64 bit target, this is 8 bytes.

A pointer-sized integer refers to an integer that's the same size (in bytes) as a memory address (pointer) on your computer's architecture.  That means that on a 32-bit architecture we need 2<sup>32</sup> different values to address all possible memory locations.

This is especially important when indexing collections as you can't have an array index larger than addressable memory. 
Even if a `i32` value would numerically fit within the bounds of a `usize` on a 64-bit system, Rust requires an explicit cast. 

**This is a deliberate design choice for type safety.** 
The goal is to ensure that indexing of a collection is done with the platform's native size type in mind, reducing bugs and forcing us to think about type conversions.

While a `i32` fits into a `usize`, the opposite is not always true. Be specific about your intent.
