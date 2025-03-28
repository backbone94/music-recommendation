# 🎧 음악 추천 Web Application

음악 추천 웹 애플리케이션은 사용자의 감정과 선호도에 맞는 음악을 추천하는 웹 애플리케이션입니다. Next.js를 기반으로 개발되었으며, 사용자는 자신의 일기를 작성하거나 감정을 기록하면 그에 맞는 음악을 추천받을 수 있습니다.

애플리케이션은 Vercel을 통해 배포되었으며, ~~다음 URL에서 확인할 수 있습니다:~~

~~**[music-recommendation-pi.vercel.app](https://music-recommendation-pi.vercel.app)**~~

## 🛠️ 기술 스택 (Tech Stack)

### 프론트엔드 (Front-End)
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Query](https://img.shields.io/badge/React_Query-%23FF4154.svg?style=for-the-badge&logo=react-query&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 백엔드 (Back-End)
![Node.js](https://img.shields.io/badge/Node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-%232D3748.svg?style=for-the-badge&logo=prisma&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-%2320232A.svg?style=for-the-badge&logo=next.js&logoColor=white)
![AWS RDS](https://img.shields.io/badge/AWS%20RDS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

### 데이터베이스 (Database)
![MySQL](https://img.shields.io/badge/MySQL-%234479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

### 배포 (Deployment)
![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

### 외부 API (External APIs)
![OpenAI](https://img.shields.io/badge/OpenAI-%23121011.svg?style=for-the-badge&logo=openai&logoColor=white)
![Naver CLOVA](https://img.shields.io/badge/Naver_CLOVA-%2300C73C.svg?style=for-the-badge&logo=naver&logoColor=white)
![Kakao](https://img.shields.io/badge/Kakao-%23FFCD00.svg?style=for-the-badge&logo=kakao&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-%23181717.svg?style=for-the-badge&logo=github&logoColor=white)
![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=youtube&logoColor=white)

## 📥 설치 및 실행 (Installation & Setup)

1. 클론
```bash
git clone https://github.com/your-username/music-recommendation-app.git
cd music-recommendation-app
```
2. 의존성 설치
```bash
npm install
```
3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 http://localhost:3000으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 🔧 환경 변수 설정 (Environment Variables)
환경 변수를 설정하기 위해 루트 디렉터리에 .env 파일을 생성하고, 다음과 같은 변수를 설정합니다:

```env
# 데이터베이스
DATABASE_URL="mysql://user:password@database_ip:3306/database_name"

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://domain:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Kakao OAuth
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"

# Naver CLOVA Sentiment
NAVER_CLIENT_ID="your-naver-client-id"
NAVER_CLIENT_SECRET="your-naver-client-secret"

# Google Cloud Platform
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPEN_AI_SECRET="your-openai-secret"
```

## ✨ 주요 기능 (Key Features)

### 사용자 인증 (User Authentication)
GitHub 및 Kakao 소셜 로그인 기능을 통해 사용자가 쉽게 로그인하고 자신의 데이터를 관리할 수 있습니다.
### 음악 추천 (Music Recommendation)
감정과 연관된 음악을 추천하며, 유튜브 영상을 통해 음악을 바로 감상할 수 있습니다.
### 감정 분석 (Sentiment Analysis)
사용자가 작성한 일기나 텍스트에서 감정을 분석하고, 그에 맞는 음악을 추천합니다.
### 일기 작성 (Diary Entry)
사용자는 자신의 일기를 작성하고, 저장된 일기를 분석하여 음악을 추천받을 수 있습니다.

## 📁 폴더 구조 (Folder Structure)
```bash
📦 음악 추천 웹 애플리케이션
 ┣ 📂app                   # 주요 애플리케이션 코드
 ┃ ┣ 📂actions             # 서버와 통신하는 함수
 ┃ ┣ 📂api                 # API 라우트
 ┃ ┣ 📂components          # 재사용 가능한 UI 컴포넌트
 ┃ ┗ 📂diary               # 일기 관련 페이지와 컴포넌트
 ┣ 📂lib                   # 유틸리티 함수 및 설정 파일
 ┣ 📂prisma                # Prisma ORM 관련 파일
 ┣ 📂public                # 정적 파일 폴더
 ┣ 📜.env                  # 환경 변수 파일
 ┣ 📜next.config.js        # Next.js 설정 파일
 ┣ 📜package.json          # 프로젝트 설정 및 의존성
 ┗ 📜README.md             # 이 파일
 ```

## 📚 사용법 (Usage)

### 회원 가입 및 로그인
GitHub 또는 Kakao 계정을 사용하여 애플리케이션에 로그인합니다.
### 일기 작성
일기를 작성하고 저장합니다.
### 음악 추천 및 감정 분석
일기를 저장한 후 일기 상세 페이지로 접근하여 추천된 음악을 확인합니다. 감정 히스토리의 "히스토리 분석" 버튼을 눌러 최근 사용자의 감정을 분석합니다.
### 배포
이 프로젝트는 Vercel 플랫폼을 사용하여 배포됩니다. Vercel에서 프로젝트를 쉽게 배포할 수 있습니다.

```bash
vercel
```

배포 후 Vercel 대시보드에서 배포 상태를 확인할 수 있습니다.
