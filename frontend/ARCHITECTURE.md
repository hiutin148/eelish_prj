# Hướng dẫn cấu trúc frontend Eelish

Tài liệu này giải thích cấu trúc `src` hiện tại bằng các khái niệm đơn giản. Bạn không cần học hết pattern trước khi code. Chỉ cần nhớ **mỗi loại file có một trách nhiệm chính** và đặt code đúng chỗ.

## 1. Bức tranh tổng quát

Ứng dụng đi theo luồng:

```text
main.tsx
  -> App.tsx
    -> AuthProvider
      -> AppRoutes
        -> Layout (Header, Sidebar, Footer)
        -> Page (Home, About, ...)
          -> Feature (todos, auth, ...)
            -> API / Hook / UI component
```

Ví dụ khi người dùng tick một todo:

```text
TodoList
  -> useTodos()
    -> toggleTodo(id)
      -> cập nhật state
        -> React render lại TodoList
```

Đây là cách chia code theo **trách nhiệm**. Khi biết một đoạn code làm việc gì, bạn sẽ biết nên đặt nó ở đâu.

---

## 2. Cây thư mục và trách nhiệm

```text
src/
├── assets/              Ảnh, font, file tĩnh được import trong code
│   └── images/
├── components/          Thành phần dùng chung ở nhiều feature
│   ├── ui/               Thành phần giao diện nhỏ, ít biết về nghiệp vụ
│   └── layout/           Khung chung của ứng dụng
├── features/            Mỗi nghiệp vụ lớn là một module riêng
│   ├── auth/
│   │   ├── components/  UI của auth, ví dụ LoginForm
│   │   ├── hooks/       Logic React của auth
│   │   ├── api/         Gọi API auth
│   │   └── index.ts     Public API của feature
│   └── todos/
├── pages/               Màn hình gắn với route
├── hooks/               Hook dùng chung, không thuộc feature cụ thể
├── lib/                 Hàm tiện ích thuần, ví dụ formatDate
├── services/            Cấu hình giao tiếp bên ngoài, ví dụ API client
├── context/             State dùng xuyên nhiều nhánh component
├── routes/              Chọn page dựa trên URL
├── constants/           Hằng số dùng chung
├── App.tsx              Root component của ứng dụng
├── main.tsx             Điểm khởi động React
└── index.css            Style nền và design token
```

### Quy tắc nhớ nhanh

- Dùng ở **một feature**: đặt trong `features/<feature-name>/`.
- Dùng ở **nhiều feature**: đặt trong `components/`, `hooks/`, `lib/` hoặc `services/`.
- Là **một màn hình theo URL**: đặt trong `pages/`.
- Là **logic nghiệp vụ**: ưu tiên đặt trong feature, không nhét vào UI dùng chung.
- Là **state toàn app**: cân nhắc `context/`.

---

## 3. Các khái niệm chính

### Component

Component là một hàm trả về giao diện JSX.

```tsx
export function Button({ children }: { children: ReactNode }) {
  return <button>{children}</button>
}
```

Component nên:

- nhận dữ liệu qua `props`;
- phát sự kiện qua callback như `onClick`;
- tránh tự gọi API nếu nó chỉ là UI dùng chung.

### Props

`props` là dữ liệu truyền từ component cha xuống component con.

```tsx
<Card className="stat-card">Nội dung</Card>
```

`Card` không cần biết nội dung là thống kê, todo hay profile. Nó chỉ nhận `children` và hiển thị khung.

### State

`state` là dữ liệu thay đổi trong thời gian component chạy.

```tsx
const [todos, setTodos] = useState<Todo[]>([])
```

Khi gọi `setTodos`, React render lại component dùng state đó.

Dùng state cho:

- dữ liệu người dùng đang nhập;
- modal đang mở hay đóng;
- danh sách thay đổi sau thao tác;
- trạng thái loading/error.

Không dùng state cho hằng số cố định. Hằng số nên đặt trong `constants/`.

### Hook

Hook là hàm bắt đầu bằng `use`, dùng để tái sử dụng logic React.

- `useTodos`: logic lấy và cập nhật todo.
- `useDebounce`: trì hoãn một giá trị trước khi dùng.
- `useAuth`: lấy thông tin đăng nhập từ context.

Hook giúp component tập trung vào việc **render**, còn logic nằm ở nơi dễ tái sử dụng và kiểm thử hơn.

### Context

Context truyền dữ liệu xuống nhiều component mà không phải truyền props qua từng tầng.

Trong dự án này:

```text
AuthProvider
  -> Header dùng user để hiển thị tên
  -> LoginForm dùng login()
```

`AuthProvider` nằm gần root trong `App.tsx`, nên các component bên dưới có thể truy cập auth.

Chỉ nên dùng Context cho dữ liệu thật sự dùng rộng, ví dụ:

- user hiện tại;
- theme;
- ngôn ngữ;
- trạng thái phiên đăng nhập.

Không nên đưa mọi state nhỏ vào Context vì sẽ làm code khó theo dõi.

### Page

Page là component đại diện cho một màn hình hoàn chỉnh, ví dụ `Home`, `About`, `NotFound`.

Page thường làm nhiệm vụ **ghép**:

```text
Home
  -> Button
  -> Card
  -> TodoList
```

Page không nên chứa quá nhiều chi tiết API hoặc logic nghiệp vụ. Nếu phần đó lớn, tách thành feature hoặc hook.

### Feature

Feature là một nhóm code phục vụ một nghiệp vụ cụ thể.

Ví dụ `features/todos/` có:

- `api/todosApi.ts`: dữ liệu todo đến từ đâu;
- `hooks/useTodos.ts`: cách ứng dụng sử dụng dữ liệu;
- `components/TodoList.tsx`: cách hiển thị todo;
- `index.ts`: những gì feature cho bên ngoài sử dụng.

Đây là **feature-based structure**: các file liên quan đến cùng nghiệp vụ ở gần nhau, thay vì rải khắp toàn bộ dự án.

### API và Service

Có hai lớp dễ nhầm:

- `features/todos/api/todosApi.ts`: API cụ thể của todo.
- `services/axiosClient.ts`: cấu hình gọi HTTP dùng chung.

Luồng mong muốn:

```text
Todo feature -> todosApi -> apiClient -> backend
```

Feature biết endpoint và kiểu dữ liệu. `apiClient` biết cách thêm base URL, header và xử lý response.

Tên file hiện tại là `axiosClient.ts`, nhưng code đang dùng `fetch`. Nếu sau này chuyển sang Axios, chỉ cần thay phần client chung và giữ API của feature ổn định.

### Utility và constants

`lib/formatDate.ts` chứa hàm thuần:

```ts
formatDate(date)
```

Hàm thuần nhận input và trả output, không render UI, không giữ state, không gọi API.

`constants/index.ts` chứa giá trị dùng chung:

- tên app;
- API base URL;
- tên route.

Không đặt các giá trị thay đổi theo người dùng vào constants.

---

## 4. Vì sao có `index.ts` trong feature?

`index.ts` là cửa ra công khai của feature, còn gọi là **barrel file**.

Thay vì import sâu:

```tsx
import { TodoList } from '../features/todos/components/TodoList'
```

Có thể import ngắn hơn:

```tsx
import { TodoList } from '../features/todos'
```

`index.ts` cũng giúp kiểm soát feature cho phép module khác dùng gì. Không cần export mọi file nội bộ.

---

## 5. Route hoạt động thế nào?

`routes/AppRoutes.tsx` đọc `window.location.hash`:

```text
#/        -> Home
#/about  -> About
route khác -> NotFound
```

Khi người dùng bấm link có `href="#/about"`, sự kiện `hashchange` làm route render lại.

Đây là một router tối giản để học cấu trúc. Ứng dụng lớn thường dùng thư viện như React Router vì cần:

- route lồng nhau;
- route bảo vệ;
- URL params;
- loading theo route;
- điều hướng bằng code.

Khi đổi sang React Router, nơi cần thay đổi chính là `routes/`; các page và feature có thể giữ nguyên.

---

## 6. Cách tạo một feature mới

Ví dụ tạo feature `decks`.

### Bước 1: tạo thư mục

```text
src/features/decks/
├── api/decksApi.ts
├── components/DeckList.tsx
├── hooks/useDecks.ts
└── index.ts
```

### Bước 2: định nghĩa kiểu dữ liệu

```ts
export type Deck = {
  id: number
  title: string
  cardCount: number
}
```

Đặt type gần feature nếu chỉ feature đó dùng. Chỉ đưa ra file chung khi nhiều feature cùng cần.

### Bước 3: viết API

```ts
export async function getDecks(): Promise<Deck[]> {
  return apiClient<Deck[]>('/decks')
}
```

API feature không nên chứa JSX.

### Bước 4: viết hook

```tsx
export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([])

  useEffect(() => {
    getDecks().then(setDecks)
  }, [])

  return { decks }
}
```

Khi có ứng dụng thật, nên bổ sung `loading`, `error`, retry và cleanup phù hợp.

### Bước 5: viết component

```tsx
export function DeckList() {
  const { decks } = useDecks()
  return (
    <ul>
      {decks.map((deck) => (
        <li key={deck.id}>{deck.title}</li>
      ))}
    </ul>
  )
}
```

### Bước 6: export từ `index.ts`

```ts
export { DeckList } from './components/DeckList'
```

### Bước 7: dùng trong page

```tsx
import { DeckList } from '../features/decks'

export function DecksPage() {
  return <DeckList />
}
```

### Bước 8: đăng ký route

Thêm page vào `routes/AppRoutes.tsx` và thêm link vào `Sidebar` nếu cần.

---

## 7. Khi nào tạo component dùng chung?

Tạo component trong `components/ui/` khi:

- nó có thể dùng ở nhiều feature;
- nó không biết nghiệp vụ cụ thể;
- giao diện và hành vi có tính lặp lại.

Ví dụ phù hợp:

- `Button`;
- `Input`;
- `Modal`;
- `Card`.

Không nên đưa `TodoList` vào `components/ui/` vì nó biết nghiệp vụ todo. Nó thuộc `features/todos/`.

Quy tắc thực tế: **đừng tổng quát hóa quá sớm**. Nếu một đoạn UI mới xuất hiện một lần, để nó ở page hoặc feature trước. Khi lặp lại và đã nhìn thấy API chung, hãy tách thành component dùng chung.

---

## 8. Quy tắc đặt code

### Đặt ở đâu?

| Bạn đang viết           | Nơi nên đặt                 |
| ----------------------- | --------------------------- |
| Nút, input, modal chung | `components/ui/`            |
| Header, sidebar, footer | `components/layout/`        |
| Form đăng nhập          | `features/auth/components/` |
| Logic danh sách todo    | `features/todos/hooks/`     |
| Endpoint todo           | `features/todos/api/`       |
| Màn hình dashboard      | `pages/Home.tsx`            |
| Format ngày             | `lib/`                      |
| Debounce dùng nhiều nơi | `hooks/`                    |
| Auth cho toàn app       | `context/`                  |
| Base URL API            | `constants/`                |

### Tránh các lỗi phổ biến

- Không gọi API trực tiếp trong `Button`, `Card`, `Input`.
- Không để một page thành file vài trăm dòng nếu có thể tách feature/component.
- Không đưa logic riêng của todo vào `components/ui/`.
- Không tạo `utils.ts` khổng lồ chứa mọi loại hàm.
- Không lạm dụng Context cho state chỉ dùng trong một component.
- Không import ngược từ feature này sang chi tiết nội bộ của feature khác nếu có thể dùng `index.ts`.

---

## 9. TypeScript tối thiểu cần nhớ

### Props

```tsx
type CardProps = {
  title: string
  count?: number
}

function Card({ title, count = 0 }: CardProps) {
  return (
    <div>
      {title}: {count}
    </div>
  )
}
```

- `string`: chuỗi;
- `number`: số;
- `boolean`: đúng/sai;
- `?`: thuộc tính không bắt buộc;
- `type`: mô tả hình dạng dữ liệu.

### Event

```tsx
function handleChange(event: ChangeEvent<HTMLInputElement>) {
  setValue(event.target.value)
}
```

Nếu TypeScript báo lỗi, hãy đọc kiểu dữ liệu mà editor gợi ý thay vì dùng `any` ngay lập tức.

### `any`

Hạn chế dùng `any` vì nó tắt kiểm tra kiểu. Tốt hơn là tạo `type` cho dữ liệu API hoặc dùng `unknown` rồi kiểm tra trước khi sử dụng.

---

## 10. Quy trình làm một màn hình mới

1. Xác định URL và tạo page trong `pages/`.
2. Liệt kê nghiệp vụ của màn hình, ví dụ lấy deck, tìm kiếm, xóa deck.
3. Tạo feature tương ứng trong `features/` nếu nghiệp vụ chưa có.
4. Tách API, hook và component trong feature.
5. Dùng component chung từ `components/ui/`.
6. Đăng ký page trong `routes/AppRoutes.tsx`.
7. Thêm link điều hướng trong `components/layout/Sidebar.tsx` nếu cần.
8. Chạy kiểm tra:

```bash
npm run build
npm run lint
```

Nếu cả hai lệnh pass, code đã qua kiểm tra TypeScript, bundler và ESLint.

---

## 11. Cách đọc một file khi mới làm quen

Khi mở một file, hãy trả lời bốn câu hỏi:

1. File này render UI, giữ state, gọi API hay chỉ format dữ liệu?
2. Nó được ai import và nó import những gì?
3. Dữ liệu đi vào qua props, Context hay API?
4. Khi dữ liệu thay đổi, component nào render lại?

Ví dụ với `TodoList.tsx`:

- render UI: có;
- giữ logic chính: không, logic nằm trong `useTodos`;
- nhận dữ liệu qua props: không, lấy từ hook;
- dữ liệu nguồn: `getTodos` trong `todosApi.ts`;
- thay đổi: `toggleTodo` cập nhật state trong hook và làm list render lại.

Chỉ cần lần theo bốn câu hỏi này, bạn có thể hiểu phần lớn codebase mà không cần biết hết mọi pattern.

---

## 12. Tóm tắt một câu cho từng thư mục

- `components`: đồ dùng giao diện dùng lại.
- `features`: nghiệp vụ độc lập.
- `pages`: màn hình theo URL.
- `hooks`: logic React dùng lại.
- `lib`: hàm tiện ích thuần.
- `services`: kết nối bên ngoài.
- `context`: dữ liệu dùng xuyên app.
- `routes`: chọn page nào được render.
- `constants`: giá trị cố định dùng chung.
- `App.tsx`: lắp các phần cấp cao.
- `main.tsx`: khởi động React.
