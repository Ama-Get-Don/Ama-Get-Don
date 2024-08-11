# frontend/Dockerfile
# 베이스 이미지 설정
FROM node:14-alpine
# 작업 디렉토리 설정
WORKDIR /tookie
# package.json과 package-lock.json 복사
COPY package*.json ./
# 의존성 설치
RUN npm install
# 앱 소스 복사
COPY . .
# 앱 빌드
RUN npm run build
# 빌드 결과를 서빙하기 위해 nginx를 사용
FROM nginx:alpine
# 빌드된 파일을 nginx의 기본 웹 루트로 복사
COPY --from=0 /tookie/dist /usr/share/nginx/html
# 컨테이너가 열어줄 포트
EXPOSE 5173
# nginx 실행
CMD ["nginx", "-g", "daemon off;"]