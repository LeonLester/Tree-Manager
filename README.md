<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/LeonLester/Tree-Manager">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Tree Manager</h3>

  <p align="center">
    An app that shows a tree structure and allows the user to add nodes by specifying the ID of the parent node to which he wants to add a node.
    The user can also clear the tree to start from scratch.
    <br />
    <a href="https://github.com/LeonLester/Tree-Manager"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <!-- <a href="https://github.com/LeonLester/Tree-Manager">View Demo</a> -->
    ·
    <a href="https://github.com/LeonLester/Tree-Manager/issues">Report Bug</a>
    ·
    <a href="https://github.com/LeonLester/Tree-Manager/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

This is a fully portable full-stack app, developed for a technical interview with Oracle.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Vue][Vue.js]][Vue-url]
* [![Perl][Perl.com]][Perl-url]
* [![Docker][Docker.com]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

You only need to follow a few steps to reproduce.

### Prerequisites

docker-compose (was tested on v.2.23.0-desktop.1)

### Installation

2. Clone the repo
   ```sh
   git clone https://github.com/LeonLester/Tree-Manager.git
   ```
3. Install docker-compose if you do not have it already
   ```sh
   sudo apt get docker-compose
   ```
4. Navigate to the repo folder and start the docker-compose
   ```sh
   cd Tree-Manager/
   docker-compose up -d
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

To use the web application after deploying it, navigate on your browser to the following URL:
   ```sh
   http://localhost:5173
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the GPTv3 License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Leonidas Karagiannis - [@leokaragiannis](https://linkedin.com/in/leokaragiannis) - leonidask914@gmail.com

Project Link: [https://github.com/LeonLester/Tree-Manager](https://github.com/LeonLester/Tree-Manager)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/LeonLester/Tree-Manager.svg?style=for-the-badge
[contributors-url]: https://github.com/LeonLester/Tree-Manager/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LeonLester/Tree-Manager.svg?style=for-the-badge
[forks-url]: https://github.com/LeonLester/Tree-Manager/network/members
[stars-shield]: https://img.shields.io/github/stars/LeonLester/Tree-Manager.svg?style=for-the-badge
[stars-url]: https://github.com/LeonLester/Tree-Manager/stargazers
[issues-shield]: https://img.shields.io/github/issues/LeonLester/Tree-Manager.svg?style=for-the-badge
[issues-url]: https://github.com/LeonLester/Tree-Manager/issues
[license-shield]: https://img.shields.io/github/license/LeonLester/Tree-Manager.svg?style=for-the-badge
[license-url]: https://github.com/LeonLester/Tree-Manager/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/leokaragiannis
[product-screenshot]: images/screenshot.png
[Vue.js]: https://img.shields.io/badge/Vue-20232A?style=for-the-badge&logo=vue&logoColor=61DAFB
[Vue-url]: https://vuejs.org/
[Perl.com]: https://img.shields.io/badge/Perl-0769AD?style=for-the-badge&logo=Perl&logoColor=white
[Perl-url]: https://perl.org 
[Docker.com]: https://img.shields.io/badge/Docker-0769AD?style=for-the-badge&logo=Docker&logoColor=white
[Docker-url]: https://docker.com