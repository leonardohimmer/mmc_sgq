import fs from 'fs';

const filePath = 'src/app/sgq/tecnico-dashboard/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the truncation at the end of TecnicoDashboardPage
const brokenEnd = /onNavigate\=\{([^}]+)\} \/><\/div><\/div>\s+\)\s+\}\s+<\/div>\s+\)\s+\}\)\(\)\}\s+<\/div>\s+\)\s+\}/;
// That might be too complex. Let's just find the specific block.

content = content.replace(/onNavigate=\{\(\) => router\.push\(STEP_CONFIG\['11'\]\.href\)\}\s+\/>\s+<\/div>\s+\)\s+\}\s+<\/div>\s+\)\s+\}\)\(\)\}\s+<\/div>\s+\)\s+\}/, 
`onNavigate={() => router.push(STEP_CONFIG['11'].href)}
                />
            </div>
        </div>
    )
}
`);

// Fix ProcessCard extra divs
content = content.replace(/                <\/div>\s+<\/div>\s+\s+<\/div>\s+<\/div>\s+\)\s+\}/,
`                </div>
            </div>
        </div>
    )
}
`);

fs.writeFileSync(filePath, content);
console.log('File updated successfully');
