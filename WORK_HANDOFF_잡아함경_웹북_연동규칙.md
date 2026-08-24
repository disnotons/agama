# 잡아함경 해설 대화 이식용 — 웹북 연동 규칙

이 문서는 잡아함경 해설을 진행하는 ChatGPT 대화·프로젝트에 그대로 전달하여 사용할 수 있는 운영 템플릿이다.

---

## 1. 역할

이 대화는 『잡아함경 쉬운 완전읽기』의 **해설 원고를 만드는 프로젝트**다.

웹북 발행을 위해 본문을 다시 편집하거나 별도의 웹사이트를 만들지 않는다.

완성된 정상 Markdown은 아래 중앙 웹북 저장소에 바로 반영될 수 있도록 준비한다.

---

## 2. 웹북 최종 저장 위치

### GitHub 기준 저장소

- Repository: `disnotons/webbooks`
- Branch: `main`
- Book directory: `books/buddhism/samyukta-agama/`

### 권별 파일명

현재 웹북의 권별 발행 파일명은 다음 형식을 사용한다.

```text
01.md
02.md
03.md
...
46.md
```

즉 제7권 정상본은:

```text
books/buddhism/samyukta-agama/07.md
```

제26권 정상본은:

```text
books/buddhism/samyukta-agama/26.md
```

처럼 저장한다.

기존 공개·발행 경로 보호를 위해 이 파일명 체계를 임의로 변경하지 않는다.

---

## 3. GitBook 연결 정보

- Site: `webbooks`
- Space ID: `t6GbbRjSwRT6aDdHcAK8`
- GitBook Project Directory: `books/buddhism/samyukta-agama`
- Git Sync 방향: `GitHub → GitBook`

GitBook에서 본문을 직접 수정하지 않는다.

GitHub의 위 디렉토리를 콘텐츠 기준본으로 사용한다.

---

## 4. 현재 정상 권

현재 정상 `NN.md` 원본이 확인되어 중앙 웹북으로 이관된 범위:

- 01–06
- 11–12
- 17–25
- 27–46

총 37권.

이 파일들은 특별한 교체 지시가 없는 한 덮어쓰거나 재작성하지 않는다.

---

## 5. 정상본 재생성 필요 권

다음 9권은 기존 `agama` 저장소에 정상 `NN.md`가 없고 조각·복구 파일만 존재했으므로 웹북 이관에서 제외되었다.

- 07
- 08
- 09
- 10
- 13
- 14
- 15
- 16
- 26

이 권들은 **잡아함경 해설 프로젝트에서 정식 원문과 기존 해설 규칙을 기준으로 정상 Markdown을 새로 생성한다.**

---

## 6. 조각·복구 파일 처리 원칙

다음 자료를 웹북 발행 프로젝트에서 임의로 이어 붙여 정상본으로 만들지 않는다.

- fragment / 조각 파일
- recovery 파일
- B64·base64 복구 자료
- 중간 생성물
- 임시 병합 파일
- 완성 여부가 불명확한 초안

이 자료들은 참고·복구 근거로는 사용할 수 있지만, 정상 발행본으로 자동 승격하지 않는다.

정상본이 없는 권은 이 해설 프로젝트에서 다시 생성한다.

기존 복구·조각 파일도 별도 지시 없이 삭제하지 않는다.

---

## 7. 새 권 생성 규칙

재생성 대상 권을 작업할 때:

1. 해당 권의 정식 범위를 확인한다.
2. 프로젝트에서 사용 중인 정식 원문과 기존 잡아함경 해설 형식을 따른다.
3. 독자가 오해하기 쉬운 부분을 방지하고 이해를 돕는 기존 해설 방향을 유지한다.
4. 완성된 권 전체를 하나의 정상 Markdown으로 만든다.
5. H1·본문·번호·인용은 완성 후 웹북 발행 편의를 위해 임의 수정하지 않는다.
6. 최종 발행 파일명은 `NN.md`로 한다.
7. 기존 같은 번호 파일이 중앙 웹북에 있으면 자동 덮어쓰지 말고 먼저 확인한다.

---

## 8. 웹북 반영 방식

한 권이 완성되면 발행 대상은:

```text
disnotons/webbooks/main
└─ books/buddhism/samyukta-agama/
   └─ NN.md
```

이다.

새 정상본 반영 후 `SUMMARY.md`에 해당 권을 올바른 순서로 추가한다.

예:

```text
06.md
07.md  ← 새 정상본
08.md  ← 새 정상본
09.md  ← 새 정상본
10.md  ← 새 정상본
11.md
```

`README.md`와 `.gitbook.yaml`은 특별한 필요가 없으면 수정하지 않는다.

가능하면 한 차례 반영은 하나의 Git tree/commit으로 처리한다.

---

## 9. 절대 하지 말 것

- 조각 파일을 추정으로 합쳐 발행본 생성
- 기존 정상 37권 재작성
- 기존 권 파일명 변경
- 기존 웹북 경로 이동
- GitBook 편집기에서 본문 수정
- 별도 sync 저장소 생성
- 별도 ingestion 구조 생성
- GitHub Pages용 자체 웹북 엔진 생성
- `site/`, `tools/`, workflow 추가
- 기존 파일 자동 덮어쓰기

---

## 10. 한 권 완료 후 보고 형식

```text
잡아함경 정상본 생성 완료

- 권: 제NN권
- 발행 파일: NN.md
- 원문 범위: ...
- 본문 생성: 완료
- 기존 파일 충돌: 없음 / 있음
- 웹북 저장소: disnotons/webbooks
- 웹북 디렉토리: books/buddhism/samyukta-agama/
- SUMMARY 반영: 완료 / 대기
- GitBook Sync: 자동 반영 / 확인 필요
```

---

## 11. 대화에 붙여 넣을 짧은 이식문

아래 내용을 새 잡아함경 해설 대화에 그대로 붙여 넣어도 된다.

> 이 대화의 잡아함경 완성 원고는 앞으로 중앙 웹북 `disnotons/webbooks`의 `books/buddhism/samyukta-agama/`에 발행한다. 권별 파일명은 기존 체계인 `NN.md`를 유지한다. 현재 정상 발행 권은 01–06, 11–12, 17–25, 27–46이며, 07–10, 13–16, 26은 정상본이 없어 재생성 대상이다. 조각·recovery·B64·임시 복구 파일을 웹북 프로젝트에서 임의 병합하지 말고, 해당 권을 이 해설 프로젝트에서 정식 원문과 기존 해설 규칙에 따라 정상 Markdown으로 새로 생성한다. 완성된 권은 `disnotons/webbooks/main/books/buddhism/samyukta-agama/NN.md`에 반영하고 `SUMMARY.md`를 갱신한다. 기존 정상 권·파일명·경로·본문은 별도 지시 없이 변경하지 않는다. GitBook Space ID는 `t6GbbRjSwRT6aDdHcAK8`, Site는 `webbooks`, Project Directory는 `books/buddhism/samyukta-agama`, Sync 방향은 GitHub → GitBook이다.
