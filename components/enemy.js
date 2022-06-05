import GAME_SETTINGS from "../constants/gameSettings.js";
import GAME_STATES from "../constants/gameStates.js";


import { Utility } from '../utils/index.js';

import bullet from "./bullet.js";
import player from "./player.js";

/** @type Utility */
let utility = null;
const baseWidth = 150;
const baseHeight = 150;

export default {
    gravity: GAME_SETTINGS.GRAVITY,
    maxVelocity: 4, //GAME_SETTINGS.MAX_VELOCITY,
    /** @type {import('../types.js').Tile[]} */
    enemies: [],
    possiblesPositions: [{
            x: GAME_SETTINGS.LIMIT_IN_X.MIN,
            y: -baseHeight - 50
        },
        {
            x: GAME_SETTINGS.LIMIT_IN_X.MIN + baseWidth,
            y: -baseHeight - 25
        },
        {
            x: GAME_SETTINGS.LIMIT_IN_X.MIN + baseWidth * 2,
            y: -baseHeight - 10
        }
    ],
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function(newContext) {
        utility = new Utility(newContext);
    },
    reset: function() {
        this.enemies.forEach(enemy => {
            utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height)
        });
        this.enemies = [];
    },
    draw: function() {
        const length = this.enemies.length;

        for (let index = 0; index < length; index++) {
            const tile = this.enemies[index];

            utility.drawImage(
                tile.imageSource,
                tile.x,
                tile.y,
                tile.width,
                tile.height
            );
        }
    },
    create: function() {
        if (this.enemies.length !== 0) return;

        // Reset the velocity
        this.maxVelocity = 3;

        /** @type {import('../types.js').Position} */
        const randomPosition1 = utility.getRandomElement(
            this.possiblesPositions,
            this.possiblesPositions.length,
            true,
            'enemyPosition'
        );

        /** @type {import('../types.js').Position} */
        const randomPosition2 = utility.getRandomElement(
            this.possiblesPositions,
            this.possiblesPositions.length,
            true,
            'enemyPosition'
        );


        /** @type {import('../types.js').Tile} */
        const enemy1 = {
            x: randomPosition1.x,
            y: randomPosition1.y,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                'assets/Enemies/X-Wing',
                6
            ),
            /**
             * @returns {import('../types.js').Collider}
             */
            getBoxCollider() {
                return {
                    x: this.x + 30,
                    y: this.y + 35,
                    width: 90,
                    height: 95
                }
            }
        };

        /** @type {import('../types.js').Tile} */
        const enemy2 = {
            x: randomPosition2.x,
            y: randomPosition2.y,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                'assets/Enemies/Y-Wing',
                4
            ),
            /**
             * @returns {import('../types.js').Collider}
             */
            getBoxCollider() {
                return {
                    x: this.x + 40,
                    y: this.y + 5,
                    width: 70,
                    height: 135
                }
            }
        };

        this.enemies.push(enemy1, enemy2);
    },
    update: function() {
        // console.debug(`Enemies quantity: ${this.enemies.length}`);

        this.enemies.forEach((enemy, index) => {
            if (enemy.y > 0) this.maxVelocity = -1;

            if (!enemy.velocityInY) enemy.velocityInY = this.maxVelocity;
            if (!enemy.y) enemy.y = 0;

            enemy.y += enemy.velocityInY;

            // console.log(`Enemy ${index} position in Y: ${enemy.y} | X: ${enemy.x}`)

            if ((enemy.y - enemy.height) > GAME_SETTINGS.BASE_HEIGHT) {
                utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
                this.enemies.splice(index, 1);
                GAME_SETTINGS.RECORD++;
                return;
            }

            if (utility.hasCollided(player, enemy)) {
                // console.debug(`Enemy ${index} collide with player`);
                utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
                this.enemies.splice(index, 1);
                player.life--;

                if (player.life === 0) {
                    GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATES.LOST;
                }
                return;
            }

            bullet.bullets.forEach((bulletTile, bulletIndex) => {
                if (!utility.hasCollided(bulletTile, enemy)) return;

                // console.debug(`Bullet ${bulletIndex} collide with enemy`);

                utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
                utility.clearRectUtil(bulletTile.x, bulletTile.y, bulletTile.width, bulletTile.height);

                this.enemies.splice(index, 1);
                bullet.bullets.splice(bulletIndex, 1);

                GAME_SETTINGS.RECORD++;
            })
        });
    },
};