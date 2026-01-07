<a id="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/yourusername/research-mate-frontend">
    <img src="src/assets/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Research Mate</h3>

  <p align="center">
    A modern, intuitive interface for streamlining academic research workflows
    <br />
    <br />
    <a href="https://research-mate-demo.com">View Demo</a>
    ·
    <a href="https://github.com/yourusername/research-mate-frontend/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/research-mate-frontend/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-variables">Environment Variables</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## What is ResearchMate ?🤔


Hi, I’m Shrinidhi. Like many students, I found myself drowning in a sea of PDFs while working on my academic research. Between managing dozens of papers, tracking my progress, and trying to analyze complex data quickly, I felt overwhelmed. I realized there had to be a better way to work.

That’s why I built Research Mate.

I wanted to create a platform that doesn't just store documents, but actually helps you understand them. By bridging the gap between AI-driven analysis and intelligent document management, Research Mate turns a chaotic folder of PDFs into a streamlined, intuitive workspace. It’s built by a researcher, for researchers. Management. 
- **AI-Powered Analysis**:
  - **Auto Annotation**: Mention the text you want to annotate and the AI will automatically annotate it for you. 
  - **Auto Tagging**: you write the paragraph and ai will tag papers for you based on the paragraph.
  - **Automated Summarization**: Instantly generate concise summaries to grasp the core concepts of complex papers.
  - **Interactive Q&A Basically RAG**: Chat directly with your documents to extract specific data points or clarify difficult sections.
  - **Intelligent Extraction**: Automatically identify and organize key findings, methodologies, and references.
  
- **Comprehensive Document Management**:
  - **Centralized Repository**: Store and manage all your research PDFs, notes, and datasets in one secure location, currently we are limited to the Text files.
  - **Advanced Annotation**: Highlight text and add persistent comments directly within the integrated PDF viewer.
  - **Smart Organization**: Utilize multi-level categorization and automated metadata extraction for effortless retrieval.



### Boosting Productivity

- **Smart Document Management** - Organize, annotate, and search through research papers effortlessly
- **Collaborative Workspace** - Share findings and collaborate with team members in real-time
- **Advanced Search** - Powerful filtering and semantic search capabilities
- **Citation Generator** - Automatically format citations in multiple styles (APA, MLA, Chicago, etc.)
- **Reading Mode** - Distraction-free interface optimized for reading and note-taking
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)[![TypeScript][TypeScript]][TypeScript-url]
[![Vite][Vite]][Vite-url]
[![TailwindCSS][TailwindCSS]][Tailwind-url]
[![React Router][ReactRouter]][ReactRouter-url][![Redux][Redux]][Redux-url]
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

[![Demo Video](https://img.youtube.com/vi/4_Yc5nl-7NM/0.jpg)](https://youtu.be/4_Yc5nl-7NM)

## Getting Started

Follow these steps to set up Research Mate Frontend locally.

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v18.0.0 or higher)
  ```sh
  node --version
  ```
- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/yourusername/research-mate-frontend.git
   ```
2. Navigate to the project directory
   ```sh
   cd research-mate-frontend
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory (see [Environment Variables](#environment-variables))

5. Start the development server
   ```sh
   npm run dev
   ```

The application will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Research Mate
VITE_ENABLE_ANALYTICS=false
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Development Mode

Run the development server with hot module replacement:

```sh
npm run dev
```

### Build for Production

Create an optimized production build:

```sh
npm run build
```

### Preview Production Build

Preview the production build locally:

```sh
npm run preview
```

### Run Tests

Execute the test suite:

```sh
npm run test
```

### Lint and Format

Check code quality:

```sh
npm run lint
npm run format
```

_For comprehensive documentation, please refer to the [Documentation](https://docs.research-mate.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->

## Project Structure

```
research-mate-frontend/
├── public/
│   └── images/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── features/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

shrinidhiachar857@gmail.com


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Font Awesome](https://fontawesome.com)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Scadcn ui](https://ui.shadcn.com/)
- [Lottie Files](https://lottiefiles.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/yourusername/research-mate-frontend.svg?style=for-the-badge
[contributors-url]: https://github.com/yourusername/research-mate-frontend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/yourusername/research-mate-frontend.svg?style=for-the-badge
[forks-url]: https://github.com/yourusername/research-mate-frontend/network/members
[stars-shield]: https://img.shields.io/github/stars/yourusername/research-mate-frontend.svg?style=for-the-badge
[stars-url]: https://github.com/yourusername/research-mate-frontend/stargazers
[issues-shield]: https://img.shields.io/github/issues/yourusername/research-mate-frontend.svg?style=for-the-badge
[issues-url]: https://github.com/yourusername/research-mate-frontend/issues
[license-shield]: https://img.shields.io/github/license/yourusername/research-mate-frontend.svg?style=for-the-badge
[license-url]: https://github.com/yourusername/research-mate-frontend/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/yourprofile
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[ReactRouter]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[ReactRouter-url]: https://reactrouter.com/
[Redux]: https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white
[Redux-url]: https://redux.js.org/

---

Thank you for checking out this project.  
Have a great day and happy coding! 😊