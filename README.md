# HOSxP Drug Dashboard

![Vue.js](https://img.shields.io/badge/vue-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)
![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A modern, high-performance desktop application for monitoring and visualizing drug data directly from HOSxP database systems. Built with top-tier web technologies and a blazingly fast Rust backend.

## Features

- **Real-Time Data Visualization**: Intuitive and interactive charts powered by ECharts.
- **Direct Database Access**: Securely connects to HOSxP MySQL databases using a high-performance Rust backend.
- **Native Experience**: Packaged as a fast, lightweight native desktop application via Tauri.
- **Modern UI**: Clean and professional user interface crafted with Vue 3, Pinia, and Lucide icons.

## Tech Stack

- **Frontend:** [Vue 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/), [Pinia](https://pinia.vuejs.org/)
- **Backend:** [Tauri](https://tauri.app/), [Rust](https://www.rust-lang.org/)
- **Data Visualization:** [Apache ECharts](https://echarts.apache.org/)

## Getting Started

### Prerequisites

Please make sure you have the following installed to run and build the project:

- [Node.js](https://nodejs.org/) (Version 18 or above recommended)
- [Rust](https://www.rust-lang.org/) (Including Cargo)
- Tauri dependencies for your operating system

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/pharmacist-sabot/hosxp-drug-dashboard.git
   cd hosxp-drug-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application in development mode:**

   ```bash
   npm run tauri dev
   ```

## Building for Production

To create a standalone application executable for your platform:

```bash
npm run tauri build
```

The output files will be located in the `src-tauri/target/release/bundle` directory.

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to learn how you can participate and help improve this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
