# 🪄 마법학교 - 주문 대결 (PWA)

주문을 외쳐 적 마법사와 싸우는 3D 마법 학교 게임. 브라우저에서 바로 실행되고, 앱처럼 설치할 수 있어요.

## 플레이 방법
- **목소리 모드**: 좌클릭을 누른 채 3초 안에 주문(화염·빙·번개·방어·투명) → 마법진 그리기 → 👏 박수로 발사
- **키 모드** (메뉴에서 목소리 모드 끄기): `Z` 화염 · `X` 빙 · `C` 번개 · `V` 방어 · `B` 투명 → 즉시 장전, 좌클릭 발사
- 이동 `WASD` · 시점 마우스 · 우클릭 마법서

## GitHub Pages로 올리기
1. GitHub에서 새 저장소(Repository)를 만들어요. (예: `magic-school`, **Public**)
2. 이 폴더 안의 파일 전부(`index.html`, `manifest.webmanifest`, `sw.js`, `icons/`, `.nojekyll`, `README.md`)를 저장소에 업로드해요.
   (저장소 화면 → **Add file → Upload files** 에 폴더째 끌어다 놓고 Commit)
3. **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)** → Save
4. 1~2분 뒤 `https://<내아이디>.github.io/<저장소이름>/` 링크가 생겨요. 그 링크를 공유하면 끝!

## 앱으로 설치
- 크롬/엣지(PC): 주소창 오른쪽의 설치 아이콘, 또는 메뉴 화면의 **📲 앱으로 설치** 버튼
- 마이크는 HTTPS에서만 쓸 수 있어요. GitHub Pages는 자동으로 HTTPS라서 괜찮아요.

## 참고
- 음성 인식(목소리 모드)은 **PC 크롬/엣지**를 권장해요. 인터넷이 필요하고, 파이어폭스·일부 사파리는 지원이 약해요.
- 키 모드는 첫 접속 후에는 인터넷 없이도 실행돼요.
- 게임을 수정해서 다시 올릴 때는 `sw.js` 맨 위의 `CACHE = 'magic-school-v1'` 숫자를 올려 주세요. (v2, v3 ...)
- 아이콘을 바꾸려면 `icons/` 안의 PNG를 같은 이름·크기로 교체하면 돼요. (192, 512, maskable 512, 180, 48)
