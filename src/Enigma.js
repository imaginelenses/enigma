import React from 'react'
import Key from './Key'
import Rotor from './Rotor'

import './Enigma.css'

let row1 = 'QWERTYUIOP'.split('')
let row2 =  'ASDFGHJKL'.split('')
let row3 =   'ZXCVBNM'.split('')

let alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

class Enigma extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            /*
                Rotor Wiring
                Rotor 1 -> Beta
                Rotor 2 -> Gamma
                Rotor 3 -> Reflector A
            
                https://en.wikipedia.org/wiki/Enigma_rotor_details#:~:text=Beta,EJMZALYXVBWFCRQUONTSPIKHGD
             */
            rotors: {
                rotor1   : 'LEYJVCNIXWPBQMDRTAKZGFUHOS'.split('').map(c => c.charCodeAt(0) - 65),
                rotor2   : 'FSOKANUERHMBTIYCWLQPZXVGJD'.split('').map(c => c.charCodeAt(0) - 65),
                rotor3   : 'EJMZALYXVBWFCRQUONTSPIKHGD'.split('').map(c => c.charCodeAt(0) - 65),
            },
            rotorPositions: {R1: 0,
                             R2: 0,
                             R3: 0},
            keydown: false,
            keysPressed: {'A': false, 'B': false, 'C': false, 'D': false, 'E': false, 'F': false, 'G': false,
                          'H': false, 'I': false, 'J': false, 'K': false, 'L': false, 'M': false, 'N': false,
                          'O': false, 'P': false, 'Q': false, 'R': false, 'S': false, 'T': false, 'U': false,
                          'V': false, 'W': false, 'X': false, 'Y': false, 'Z': false},
            keysLitUp  : {'A': false, 'B': false, 'C': false, 'D': false, 'E': false, 'F': false, 'G': false,
                          'H': false, 'I': false, 'J': false, 'K': false, 'L': false, 'M': false, 'N': false,
                          'O': false, 'P': false, 'Q': false, 'R': false, 'S': false, 'T': false, 'U': false,
                          'V': false, 'W': false, 'X': false, 'Y': false, 'Z': false},
            ciphertext: '',
            plaintext: ''
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', (event) => {
            if (this.state.keydown) {
                return
            }
            
            let key = event.key.toUpperCase()
            console.log(key)
            
            if (!alphabets.includes(key)) {
                return
            }

            
            this.setState((state) => {
                state.keysPressed[key] = true
                
                let rotorEncryptedKey = this.rotorEncrypt(key, state.rotors)

                if (alphabets.includes(rotorEncryptedKey)) {
                    state.keysLitUp[rotorEncryptedKey] = true
                }

                // Rotors
                let {rotor1, rotor2, rotor3} = state.rotors

                // Rotor positions
                let {R1, R2, R3} = state.rotorPositions

                if (R1 === 25) {
                    if (R2 === 25) {
                        if (R3 === 25) {
                            R3 = -1
                        }
                        // Advance rotor3
                        let temp = rotor3.slice(1)
                        temp.push(rotor3[0])
                        rotor3 = temp
                        R3++

                        R2 = -1
                    }
                    // Advance rotor2
                    let temp = rotor2.slice(1)
                    temp.push(rotor2[0])
                    rotor2 = temp
                    R2++

                    R1 = -1
                }
                // Advance rotor1
                let temp = rotor1.slice(1)
                temp.push(rotor1[0])
                rotor1 = temp
                R1++
                
                return {
                    keydown: true,
                    keysPressed: state.keysPressed,
                    rotors: {rotor1, rotor2, rotor3},
                    rotorPositions: {R1, R2, R3},
                    ciphertext: state.ciphertext + rotorEncryptedKey,
                    plaintext: state.plaintext + key,
                }
            })
        })
        
        document.addEventListener('keyup', (event) => {
            this.setState((state) => {
                Object.keys(state.keysPressed).forEach(key => state.keysPressed[key] = false)
                Object.keys(state.keysLitUp  ).forEach(key => state.keysLitUp[key]   = false)

                return {
                    keydown: false,
                    keysPressed: state.keysPressed,
                    keysLitUp: state.keysLitUp
                }
            })
        })
    }

    render() {
        return (
            <div className='enigma'>
                <div className='left'>
                    {/* Rotorboard */}
                    <div className='rotorboard'>
                        <Rotor alpha={String.fromCharCode(this.state.rotorPositions.R3 + 65)}
                               forward={() => this.rotateForward("R3")} 
                               backward={() => this.rotateBackward("R3")}/>
                        <Rotor alpha={String.fromCharCode(this.state.rotorPositions.R2 + 65)} 
                               forward={() => this.rotateForward("R2")} 
                               backward={() => this.rotateBackward("R2")}/>
                        <Rotor alpha={String.fromCharCode(this.state.rotorPositions.R1 + 65)} 
                               forward={() => this.rotateForward("R1")} 
                               backward={() => this.rotateBackward("R1")}/>
                    </div>
                    
                    {/* Lightboard */}
                    <div className='keyboard'>
                        <div className='row'>
                            {row1.map((alpha, index) => (
                                <Key key={index} alpha={alpha} isSelected={this.state.keysLitUp[alpha]} selectedColor='gold'/>
                            ))}
                        </div>
                        <div className='row' style={{marginLeft: '3vh'}}>
                            {row2.map((alpha, index) => (
                                <Key key={index} alpha={alpha} isSelected={this.state.keysLitUp[alpha]} selectedColor='gold'/>
                            ))}
                        </div>
                        <div className='row' style={{marginLeft: '12vh'}}>
                            {row3.map((alpha, index) => (
                                <Key key={index} alpha={alpha} isSelected={this.state.keysLitUp[alpha]} selectedColor='gold'/>
                            ))}
                        </div>
                    </div>
                    
                    {/* Keyboard */}
                    <div className='keyboard'>
                        <div className='row'>
                            {row1.map((alpha, index) => (
                                <Key key={index} alpha={alpha} isSelected={this.state.keysPressed[alpha]} selectedColor='white'/>
                            ))}
                        </div>
                        <div className='row' style={{marginLeft: '3vh'}}>
                            {row2.map((alpha, index) => (
                                <Key key={index} alpha={alpha} isSelected={this.state.keysPressed[alpha]} selectedColor='white'/>
                            ))}
                        </div>
                        <div className='row' style={{marginLeft: '12vh'}}>
                            {row3.map((alpha, index) => (
                                <Key key={index} alpha={alpha} isSelected={this.state.keysPressed[alpha]} selectedColor='white'/>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='right' >
                    <img className='logo' src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Enigma-logo.svg/2880px-Enigma-logo.svg.png'/>

                    <div className='textbox'>
                        <label htmlFor='cipertext'>Cipertext</label>
                        <textarea id='ciphertext' value={this.state.ciphertext} disabled={true} />
                    </div>

                    <div className='textbox'>
                        <label htmlFor='cipertext'>Plaintext</label>
                        <textarea id='plaintext'  value={this.state.plaintext}  disabled={true} />
                    </div>
                </div>
            </div>
        )
    }

    rotorEncrypt = (alpha, rotors) => {
        // Alphabet index
        let index = alpha.toUpperCase().charCodeAt(0) - 65

        // Rotors
        let {rotor1, rotor2, rotor3} = rotors

        // Forward Rotor1 -> Rotor2 -> Rotor3
        let forward = rotor3[rotor2[rotor1[index]]]

        // Reverse Rotor3 -> Rotor2 -> Rotor3
        let reverse = rotor1.indexOf(rotor2.indexOf(forward))

        return String.fromCharCode(reverse + 65)
    }

    rotateForward = (rotor) => {
        this.setState((state) => {
            let {R1, R2, R3} = state.rotorPositions

            let {rotor1, rotor2, rotor3} = state.rotors

            let temp
            switch (rotor) {
                case 'R1':
                    // Advance rotor1
                    temp = rotor1.slice(1)
                    temp.push(rotor1[0])
                    rotor1 = temp
                    R1++
                    break;
                case 'R2':
                    // Advance rotor2
                    temp = rotor2.slice(1)
                    temp.push(rotor2[0])
                    rotor2 = temp
                    R2++
                    break;
                case 'R3':
                    // Advance rotor3
                    temp = rotor3.slice(1)
                    temp.push(rotor3[0])
                    rotor3 = temp
                    R3++
                    break;
            }

            return {
                rotors: {rotor1, rotor2, rotor3},
                rotorPositions: {R1, R2, R3},
            }
        })
    }

    rotateBackward = (rotor) => {
        this.setState((state) => {
            let {R1, R2, R3} = state.rotorPositions

            let {rotor1, rotor2, rotor3} = state.rotors

            let temp
            switch (rotor) {
                case 'R1':
                    // Recede rotor1
                    temp = [rotor1.pop(), ...rotor1]
                    rotor1 = temp
                    R1 = Math.max(R1 - 1, 25 - R1)
                    break;
                case 'R2':
                    // Recede rotor2
                    temp = [rotor2.pop(), ...rotor2]
                    rotor2 = temp
                    R2 = Math.max(R2 - 1, 25 - R2)
                    break;
                case 'R3':
                    // Recede rotor3
                    temp = [rotor3.pop(), ...rotor3]
                    rotor3 = temp
                    R3 = Math.max(R3 - 1, 25 - R3)
                    break;
            }

            return {
                rotors: {rotor1, rotor2, rotor3},
                rotorPositions: {R1, R2, R3},
            }
        })
    }
}

export default Enigma