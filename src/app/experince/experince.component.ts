import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {experince, experince1, experince2, experince3,iosDevelopmentPoints, iosDevelopmentPoints1, iosDevelopmentPoints3, ionicAngularExperience, ionicAngularExperience1, ionicAngularExperience2} from 'src/assets/data/mydata'


@Component({
  selector: 'app-experince',
  templateUrl: './experince.component.html',
  styleUrls: ['./experince.component.scss']
})
export class ExperinceComponent implements OnInit, AfterViewInit {
  
  
  paragraphs = experince;
  paragraphs1 = experince1;
  paragraphs2 = experince2;
  paragraphs3 = experince3;
  iosPoints: iosPointsClass[] = [];
  iosPoints1: iosPointsClass[] = [];
  iosPoints2: iosPointsClass[] = [];
  ionic: string[] = [];
  ionic1: string[] = [];
  ionic2: string[] = [];

  iosKeywords = [
    'Navigation Controllers', 'Delegates', 'Data Sources', 'UITableView', 'UICollectionView', 
    'URLSession', 'JSON parsing', 'Alamofire', 'REST API', 'HTTP interceptor', 'CSRF tokens',
    'Dynamic UI Components', 'Classes', 'Models', 'API responses', 'Auto Layout Constraints', 
    'Scroll View', 'iPhone screen sizes','Model-View-Controller', 'Single Sign-On','UIview' , 'cell views'
  ];

  constructor(private sanitizer: DomSanitizer) {}


  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger)
    const container = document.querySelector(".container");
    const sections = gsap.utils.toArray(".container section");
    const texts = gsap.utils.toArray(".anim");
    const mask = document.querySelector(".mask");

    let scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".container",
        pin: true,
        scrub: true,
        end: "+=3000"
      }
    });

    console.log(1 / (sections.length - 1))

    //Progress bar animation

    gsap.to(mask, {
      width: "110%",
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top left",
        scrub: 1
      }
    });

    // whizz around the sections
    sections.forEach((section: any) => {
      // grab the scoped text
      let text = section.querySelectorAll(".anim");
      
      // bump out if there's no items to animate
      if(text.length === 0)  return 
      
      // do a little stagger
      gsap.fromTo(text,
        {
          y: -130,
          opacity: 0,
          scale: 1.2
      }, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 3,
        ease: "elastic.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          containerAnimation: scrollTween,
          start: "left center",
          end: "right 10%"
        }
      });
    });
  }

  ngOnInit(): void {

    this.iosPoints = iosDevelopmentPoints;
    console.log(this.iosPoints);
    this.iosPoints1 = iosDevelopmentPoints1;
    this.iosPoints2 = iosDevelopmentPoints3;
    this.ionic = ionicAngularExperience;
    this.ionic1 = ionicAngularExperience1;
    this.ionic2 = ionicAngularExperience2;

  }

  highlightKeywords(text: string): SafeHtml {
    const keywords = ['Angular', 'Ionic', 'RESTful APIs', 'Spring Boot', 'Kafka', 'Jenkins', 'Git', 'PostgreSQL','HTML','CSS', 'JavaScript'];
    let highlightedText = text;

    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi'); // Case-insensitive match
      highlightedText = highlightedText.replace(regex, `<span class="highlight">$1</span>`);
    });

    return this.sanitizer.bypassSecurityTrustHtml(highlightedText); // Bypass sanitization safely
  }

  highlightIosKeywords(text: string): SafeHtml {
    let highlightedText = text;

    this.iosKeywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, 'gi'); // Case-insensitive match
      highlightedText = highlightedText.replace(regex, `<span class="highlight">$1</span>`);
    });

    return this.sanitizer.bypassSecurityTrustHtml(highlightedText); // Sanitize the HTML content
  }

}

export class iosPointsClass{
  heading!: string;
  details!: string[];
}