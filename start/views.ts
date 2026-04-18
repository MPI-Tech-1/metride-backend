import edge from 'edge.js'
import env from '#start/env'
import { DateTime } from 'luxon'

edge.global('currentYear', () => `${DateTime.now().year}`)

edge.global('env', (key: string, defaultValue?: any) => env.get(key, defaultValue))
