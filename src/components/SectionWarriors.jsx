import React, { useState } from 'react';
import { sound } from '../utils/soundEngine';
import WarriorCard from './WarriorCard';
import WarriorDossierModal from './WarriorDossierModal';
import AnimatedChapterHeading from './AnimatedChapterHeading';

export const warriorsData = [
  {
    id: 'musashi',
    name: 'Miyamoto Musashi',
    japanese: '宮本 武蔵',
    kanjiHonorific: '剣聖 · 二天一流',
    title: 'THE SWORD SAINT',
    era: '1584 – 1645 · Sengoku to Early Edo',
    signatureWeapon: 'Daishō (Two Blades: Katana & Wakizashi / Bokken)',
    style: 'Niten Ichi-ryū (Two Heavens as One)',
    crest: 'Niten Cross',
    quote: 'Fixation is the way to death. Fluidity is the way to life.',
    bio: 'Renowned as the supreme swordsman in Japanese history. Unbeaten in over 60 life-and-death duels from age 13, Musashi spent his final contemplative years in the Reigandō cave writing The Book of Five Rings (五輪書), a timeless treatise on strategy and Zen detachment.',
    verifiedFacts: [
      'Invented the two-sword fighting school (Niten Ichi-ryū) after observing European dueling rapiers and Portuguese sailors.',
      'Defeated Sasaki Kojirō on Ganryūjima Island in 1612 using a wooden bokken carved from a boat oar.',
      'Was an accomplished sumi-e painter, calligrapher, and landscape garden architect for the Hosokawa clan.',
    ],
    legendVsMyth: [
      'Myth: Musashi was an unwashed rogue living in filth. Reality: Historical records from the Hosokawa clan show he held a dignified guest-retainer position and taught art and philosophy.',
      'Myth: He fought dishonorably by arriving late to duels. Reality: Psychological warfare (heihō) was a recognized strategic art of destabilizing the opponent’s composure.',
    ],
    campaigns: [
      { year: '1600', name: 'Battle of Sekigahara', desc: 'Fought among the Ukita hideie vanguard, surviving the catastrophic Western Army collapse.' },
      { year: '1604', name: 'Ichijōji Pine Duel', desc: 'Annihilated the elite Yoshioka sword school masters in Kyoto single-handedly.' },
      { year: '1612', name: 'Duel on Ganryūjima Island', desc: 'Neutralized Sasaki Kojirō’s legendary Nodachi "Drying Pole" with a carved wooden oar.' },
      { year: '1638', name: 'Shimabara Rebellion', desc: 'Served as tactical advisor to the Tokugawa Shogunate command.' },
    ],
    accentColor: '#D90416',
  },
  {
    id: 'nobunaga',
    name: 'Oda Nobunaga',
    japanese: '織田 信長',
    kanjiHonorific: '天下布武 · 第六天魔王',
    title: 'THE GREAT UNIFIER',
    era: '1534 – 1582 · Sengoku Jidai',
    signatureWeapon: 'Tanegashima Matchlock Arquebuses & Naginata',
    style: 'Total Battlefield Integration & Volley Fire Tactics',
    crest: 'Oda Mokkō (Melon Flower)',
    quote: 'If the cuckoo does not sing, kill it.',
    bio: 'The ruthless visionary who initiated the reunification of feudal Japan. Nobunaga shattered archaic clan doctrines by arming peasant ashigaru with European firearms, developing three-rank rotating volley fire at Nagashino, and establishing free-market economic zones.',
    verifiedFacts: [
      'Annihilated Imagawa Yoshimoto’s force of 25,000 with only 3,000 men at the surprise Battle of Okehazama (1560).',
      'First Japanese commander to construct ironclad warships (Atakebune) to defeat the Mori navy.',
      'Died at Honnō-ji temple in Kyoto in 1582 after being betrayed by his trusted general, Akechi Mitsuhide.',
    ],
    legendVsMyth: [
      'Myth: Nobunaga was merely a demonic brute (Dairokuten Maō). Reality: He was an enlightened patron of the arts, welcoming Jesuit scholars and sponsoring the tea master Sen no Rikyū.',
      'Myth: Matchlocks were strictly imported. Reality: He established domestic gunsmithing factories in Kunitomo and Sakai.',
    ],
    campaigns: [
      { year: '1560', name: 'Battle of Okehazama', desc: 'Shattered Imagawa’s 25,000-man army in a lightning thunderstorm ambush with 3,000 warriors.' },
      { year: '1570', name: 'Battle of Anegawa', desc: 'Overcame combined Asai and Asakura clan forces in blood-soaked river shallows.' },
      { year: '1575', name: 'Battle of Nagashino', desc: 'Pioneered 3-rank rotating matchlock volley fire, decimating the invincible Takeda cavalry.' },
      { year: '1582', name: 'Incident at Honnō-ji', desc: 'Betrayed by general Akechi Mitsuhide, perishing in the flames after committing seppuku.' },
    ],
    accentColor: '#B30212',
  },
  {
    id: 'masamune',
    name: 'Date Masamune',
    japanese: '伊達 政宗',
    kanjiHonorific: '独眼竜 · 奥州の覇者',
    title: 'THE ONE-EYED DRAGON',
    era: '1567 – 1636 · Late Sengoku to Early Edo',
    signatureWeapon: 'Black Lacquered Katana & Nanban Armor',
    style: 'Oshu Cavalry Shock Tactics & Diplomatic Statecraft',
    crest: 'Bamboo & Sparrow (Take ni Suzume)',
    quote: 'Rectitude carried to excess hardens into stiffness; benevolence indulged beyond measure sinks into weakness.',
    bio: 'The legendary daimyo of Sendai who lost his right eye to smallpox as a child. Renowned for his towering golden crescent-moon helmet (maedate), fearless frontline cavalry leadership, and ambitious diplomacy that dispatched the first Japanese embassy to Europe and the Vatican.',
    verifiedFacts: [
      'United the rugged northern Tōhoku provinces at age 24 and founded the modern city of Sendai.',
      'Financed and constructed the 500-ton Western-style galleon San Juan Bautista, sending Hasekura Tsunenaga to Rome (1613).',
      'Earned the respect of both Hideyoshi and Tokugawa Ieyasu through political cunning and military indispensability.',
    ],
    legendVsMyth: [
      'Myth: Masamune plucked out his own diseased eye with a dagger. Reality: Historical clan annals record that his retainers excised the dead eye under his fierce instruction.',
      'Myth: He wore Western armor solely for fashion. Reality: Nanban do gusoku offered superior deflection against bullets.',
    ],
    campaigns: [
      { year: '1585', name: 'Battle of Hitotoribashi', desc: 'Fought against overwhelming 30,000 coalition troops, holding the line till nightfall.' },
      { year: '1589', name: 'Battle of Suriagehara', desc: 'Crushed the Ashina clan to achieve absolute supremacy across northern Japan (Oshu).' },
      { year: '1613', name: 'Keichō Embassy to Rome', desc: 'Dispatched 180 Japanese diplomats and samurai aboard the San Juan Bautista to the Vatican.' },
      { year: '1615', name: 'Siege of Osaka', desc: 'Commanded the vanguard of the Tokugawa northern army, breaking through Osaka defenses.' },
    ],
    accentColor: '#D4AF37',
  },
  {
    id: 'yukimura',
    name: 'Sanada Yukimura',
    japanese: '真田 幸村',
    kanjiHonorific: '日本一の兵 · 真田丸',
    title: 'THE CRIMSON DEMON',
    era: '1567 – 1615 · Siege of Osaka',
    signatureWeapon: 'Jūmonji Yari (Cross-bladed Spear)',
    style: 'Guerrilla Fortification & Desperate Cavalry Charges',
    crest: 'Rokumonsen (Six Coins for the Underworld)',
    quote: 'A life lived for honor needs only one decisive battle.',
    bio: 'Revered across Japan as the "Number One Warrior in the Land" (Nihon Ichi no Tsuwamono). Leading his famous crimson-armored warriors (Akazonae), he defended the fortress of Osaka against the overwhelming forces of the Tokugawa shogunate, nearly assassinating Ieyasu in a suicidal charge.',
    verifiedFacts: [
      'Designed and commanded the Sanada-maru, an ingenious semi-circular barbican that repelled 30,000 Tokugawa troops in 1614.',
      'Wore the Rokumonsen crest—representing the six coins required to pay the ferryman to cross the Sanzu River into the afterlife—symbolizing ready acceptance of death.',
      'Charged through three waves of the Tokugawa main battle line at Tennoji, forcing Ieyasu to abandon his standard.',
    ],
    legendVsMyth: [
      'Myth: His true historical name was Yukimura. Reality: Contemporary documents refer to him as Sanada Nobushige; "Yukimura" was popularized in Edo-period kabuki plays.',
      'Myth: The Sanada clan was destroyed. Reality: His elder brother Sanada Nobuyuki sided with Tokugawa, ensuring the clan’s survival as daimyos of Matsushiro.',
    ],
    campaigns: [
      { year: '1600', name: 'Second Siege of Ueda', desc: 'Repelled Tokugawa Hidetada’s 38,000-strong army with only 2,500 defenders at Ueda Castle.' },
      { year: '1614', name: 'Battle of Sanada-maru', desc: 'Inflicted devastating casualties on the Tokugawa vanguard from his custom-built earthen barbican.' },
      { year: '1615', name: 'Battle of Tennōji', desc: 'Led a suicidal final cavalry charge that penetrated directly into Tokugawa Ieyasu’s command tent.' },
    ],
    accentColor: '#D90416',
  },
];

export default function SectionWarriors() {
  const [selectedWarrior, setSelectedWarrior] = useState(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const warriorParam = params.get('warrior') || params.get('dossier');
    if (warriorParam) {
      const match = warriorsData.find((w) => w.id === warriorParam.toLowerCase());
      if (match) setSelectedWarrior(match);
    }
  }, []);

  const openWarrior = (w) => {
    sound.playSwordSlash();
    setSelectedWarrior(w);
    document.body.style.overflow = 'hidden';
  };

  const closeWarrior = () => {
    sound.playWoodenClick();
    setSelectedWarrior(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="section-warriors" id="warriors">
      {/* Background Maple Framing Branches */}

      <div className="section-container">
        {/* Section Header */}
        <div className="section-meta-row">
          <span className="section-index">03 / 06</span>
          <span className="section-meta-tag">HALL OF TITANS · HISTORICAL ARCHIVES</span>
          <span className="section-meta-kanji">伝説の武将 · 英雄録</span>
        </div>

        <div className="warriors-intro-row">
          <div className="warriors-intro-heading">
            <AnimatedChapterHeading
              chapter="warriors"
              sectionLabel="HISTORICAL CHRONICLES · KYOTO VAULT"
              primaryText="LEGENDARY"
              accentText="WARRIORS."
              breakLine={false}
              className="warriors-main-title"
            />
          </div>
          <p className="warriors-intro-text">
            Four iconic titans whose martial genius, blade mastery, and unyielding honor
            shaped the destiny of feudal Japan. Hover over each card to awaken their spirit; click to inspect their complete archival dossier.
          </p>
        </div>

        {/* 4 Warriors Cinematic Card Showcase */}
        <div className="warriors-grid">
          {warriorsData.map((w, index) => (
            <WarriorCard
              key={w.id}
              warrior={w}
              index={index}
              onSelect={openWarrior}
            />
          ))}
        </div>
      </div>

      {/* RICH PROFILE DOSSIER MODAL */}
      <WarriorDossierModal
        warrior={selectedWarrior}
        onClose={closeWarrior}
      />
    </section>
  );
}
