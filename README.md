# Shopping-mall

### Node js Express를 이용한 Shopping mall 구현

---



### Requirements

---

- 회원가입, 로그인 , 로그아웃, 비밀번호 재설정 기능
  - [x] 회원가입 시 웰컴 이메일을 전송 한다.
  - [x] 로그인 시 Session Database에 해당 유저 정보 저장 한다.
  - [x] 로그아웃 시 해당 Session destroy 한다.
  - [x] 비밀번호 재설정 요구시, 사용자 이메일에 재설정 페이지 주소를 전송(토큰을 파라미터로 전달) 한다.
- 장바구니 기능
  - [x] 상품을 장바구니에 담을 수 있다.
  - [x] 장바구니 페이지 내에서 상품 수량을 수정 할 수 있다.
  - [x] 장바구니 페이지 내에서 해당 상품을 삭제 할 수 있다.
  - [x] 장바구니에서 check 된 상품만 주문 할 수 있다.
- 주문 기능 
  - [x] 장바구니로부터 주문 상품을 담을 수 있다.
  - [x] 주문 페이지 내에서 상품 수량을 수정 할 수 있다.
  - [x] 주문 페이지 내에서 해당 상품을 삭제 할 수 있다.
- 상품 검색 기능
  - [x] 상품 제목을 기준으로 상품을 검색 할 수 있다.
- 리뷰 기능
  - [x] 상품 디테일 페이지 내에서 리뷰를 작성 할 수 있다.
  - [x] 하나의 상품에 대해 유저 당 하나의 리뷰만 등록 가능하다.
- Seller (판매자) 등록 및 취소 기능
  - [x] 판매자로 등록된 유저는 상품을 등록 및 삭제 , 수정 할 수 있다.
  - [x] 판매자 취소를 하면 해당 유저가 등록한 상품은 모두 삭제된다.
- 상품 등록 및 삭제 수정 기능
  - [x] 판매자로 등록된 유저 한정 상품을 등록 , 수정, 삭제 할 수 있다.





### Development Environment

---

- framework : Express.js
- database : Mongo DB
- template engine : EJS



### Reference

---
[ Udemy Node js Complete guie ]( https://www.udemy.com/course/nodejs-the-complete-guide )



