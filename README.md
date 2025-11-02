note:"this readme is generated using LLM"

# 🧩 Optical Rule – Interactive Optical Component Editor

This project is an interactive **optical design simulator** built using **Next.js**, **React Konva**, and **Tailwind CSS**.  
It allows users to **drag and drop optical components** (like lenses, beam splitters, and lasers) onto a canvas, modify their properties, and save or load designs as JSON files.

---

## 🚀 Features

- 🖱️ **Drag & Drop** optical components from a side panel onto the Konva canvas
- ⚙️ **Dynamic Property Editing** — Adjust parameters like _focal length_, _intensity_, or _reflectivity_ in real time
- 💾 **Save and Load Designs** — Export your setup as a JSON file or import it back
- 🧱 **Resizable and Rotatable Components** — Rotate and scale elements using Konva’s built-in transformer
- 🧩 **Custom Component Attributes** depending on the selected optical element
- 💡 Built with modern web stack: **Next.js**, **React Konva**, **Tailwind CSS**

---

## 🛠️ Tech Stack

| Tool             | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **Next.js**      | React framework for building the web app |
| **React Konva**  | Canvas-based interactive graphics        |
| **Tailwind CSS** | Utility-first CSS framework for styling  |

---

## 🧰 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/25sahilsingh/opticalrule.git
cd opticalrule
2. Install Dependencies
bash
Copy code
npm install
3. Run the Development Server
bash
Copy code
npm run dev
Then open http://localhost:3000 in your browser.

🧩 How It Works
🪄 Add Components
Drag any optical element (like lens, beam splitter, etc.) from the left panel and drop it on the canvas.

⚙️ Edit Properties
Select a component to open the Properties Panel (on the right).

Modify numeric values such as position, rotation, or optical parameters.

💾 Save or Load Setup
Click Download JSON to save the current layout.

Click Upload JSON to import a saved configuration.

```
